"""验证 tarball 安装后的生产页面和固定版本 CDN 路径；不访问仓库源码。"""
import argparse
import functools
import json
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser()
parser.add_argument("consumer", type=Path)
parser.add_argument("--output", type=Path, default=Path(__file__).parent)
parser.add_argument("--public", action="store_true", help="仅验证公开总包和 CDN 页面")
args = parser.parse_args()
args.output.mkdir(parents=True, exist_ok=True)
package = args.consumer / "node_modules/@aiyazone/design-system"
version = json.loads((package / "package.json").read_text())["version"]
prefix = f"/npm/@aiyazone/design-system@{version}/"
cdn_html = f"""<!doctype html><html><head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="{prefix}dist/index-v3.css">
</head><body>
<zone-button>验证按钮</zone-button><zone-icon name="plus"></zone-icon>
<span data-i18n-key="common.submit"></span><button id="language">日本語</button>
<script type="module">
import {{ setCurrLanguage }} from '{prefix}dist/cdn/index.js';
setCurrLanguage('en');
document.querySelector('#language').addEventListener('click', () => setCurrLanguage('ja'));
</script></body></html>"""


class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/cdn.html":
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(cdn_html.encode())
        else:
            super().do_GET()

    def translate_path(self, path):
        if path.startswith(prefix):
            return str(package / path.removeprefix(prefix))
        return super().translate_path(path)

    def log_message(self, *_args):
        pass


server = ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Handler, directory=str(args.consumer / "dist")))
thread = Thread(target=server.serve_forever, daemon=True)
thread.start()
results = []
try:
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome", headless=True)
        try:
            for width in [1440, 768, 390]:
                for scenario in (["bundle", "cdn"] if args.public else ["core", "bundle", "mixed", "reverse", "cdn"]):
                    page = browser.new_page(viewport={"width": width, "height": 900})
                    page.set_default_timeout(5000)
                    errors, failed, requests = [], [], []
                    page.on("pageerror", lambda error: errors.append(str(error)))
                    page.on("requestfailed", lambda request: failed.append(request.url))
                    page.on("response", lambda response: failed.append(response.url) if response.status >= 400 else None)
                    page.on("request", lambda request: requests.append(request.url))
                    page.goto(f"http://127.0.0.1:{server.server_port}/{scenario}.html", wait_until="domcontentloaded")
                    page.wait_for_function("""() => document.querySelector('zone-button')?.shadowRoot?.querySelector('button')
                        && document.querySelector('zone-icon')?.shadowRoot?.querySelector('svg')
                        && document.querySelector('[data-i18n-key]').textContent === 'Submit'""")
                    evidence = page.evaluate("""(scenario) => {
                        const button = document.querySelector('zone-button');
                        const icon = document.querySelector('zone-icon');
                        if (scenario !== 'cdn' && !(button instanceof window.consumerLit && icon instanceof window.consumerLit)) {
                            throw Error('npm 组件必须共享消费者的 Lit');
                        }
                        const versions = ['litHtmlVersions', 'litElementVersions', 'reactiveElementVersions']
                          .map(key => [key, window[key]]);
                        if (versions.some(([, values]) => values?.length !== 1)) throw Error('页面含重复 Lit');
                        const theme = getComputedStyle(document.documentElement).getPropertyValue('--zone-color-primary').trim();
                        if (!theme) throw Error('主题令牌缺失');
                        let clicks = 0;
                        button.addEventListener('zone-click', () => clicks++);
                        window.getClicks = () => clicks;
                        return { theme, versions };
                    }""", scenario)
                    page.evaluate("document.documentElement.style.setProperty('--zone-color-primary', 'rgb(1, 2, 3)')")
                    page.wait_for_function("""() => getComputedStyle(document.querySelector('zone-button')
                      .shadowRoot.querySelector('button')).backgroundColor === 'rgb(1, 2, 3)'""")
                    page.evaluate("document.documentElement.style.removeProperty('--zone-color-primary')")
                    page.locator("zone-button").get_by_role("button").click()
                    assert page.evaluate("window.getClicks()") == 1
                    page.locator("#language").click()
                    page.wait_for_function("() => document.querySelector('[data-i18n-key]').textContent === '送信'")
                    assert not errors, errors
                    assert not failed, failed
                    js_requests = [url for url in requests if url.endswith(".js")]
                    assert all(url.startswith(f"http://127.0.0.1:{server.server_port}/") for url in js_requests), js_requests
                    if scenario == "cdn":
                        assert js_requests == [f"http://127.0.0.1:{server.server_port}{prefix}dist/cdn/index.js"], js_requests
                        page.screenshot(path=str(args.output / f"cdn-{width}.png"))
                    results.append({"scenario": scenario, "width": width, "version": version, **evidence,
                                    "external_assets": [url for url in requests if not url.startswith("http://127.0.0.1:")],
                                    "passed": True})
                    print(f"{scenario} / {width}: 按钮、图标、主题、英语→日语、单份 Lit 通过")
                    page.close()
        finally:
            browser.close()
finally:
    server.shutdown()
    server.server_close()
    thread.join()
    (args.output / "browser-results.json").write_text(json.dumps(results, ensure_ascii=False, indent=2))
