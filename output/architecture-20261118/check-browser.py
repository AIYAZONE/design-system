from playwright.sync_api import sync_playwright, expect
from pathlib import Path
import json
import os

out = Path(__file__).resolve().parent
bases = os.environ.get("ARCH_BASES", "http://localhost:5173").split(",")
results = []
with sync_playwright() as p:
    browser = p.chromium.launch(channel="chrome")
    for base in bases:
        for width, height in [(1440, 900), (768, 1024), (390, 844)]:
            page = browser.new_page(viewport={"width": width, "height": height}, reduced_motion="reduce")
            errors, failed = [], []
            page.on("pageerror", lambda error: errors.append(str(error)))
            page.on("response", lambda response: failed.append(response.url) if response.status >= 400 and response.url.startswith(base) else None)
            page.goto(base + "/architecture.html", wait_until="networkidle")
            page.locator("body").aria_snapshot()
            assert page.locator("[data-band]").count() == 7, "七条能力带"
            assert page.locator("[data-chain]").count() == 4, "三条链路与重置"
            assert page.locator("[data-view]").count() == 0, "移除旧五视图"
            assert page.locator("[data-group]").count() == 28
            assert page.locator("[data-relation] svg").count() == 8
            assert not page.locator("[data-capability-dialog]").evaluate("(e) => e.open")
            assert page.evaluate("document.documentElement.scrollWidth <= innerWidth"), width
            assert page.locator("[data-band]").first.bounding_box()["y"] < height
            assert page.locator("[data-group]").evaluate_all("(nodes) => nodes.every(e => e.scrollWidth <= e.clientWidth && e.scrollHeight <= e.clientHeight)")
            page.screenshot(path=str(out / f"overview-{width}.png"), full_page=True)
            groups = page.locator("[data-group]").evaluate_all("(nodes) => nodes.map(e => ({id:e.dataset.group, title:e.querySelector('strong').textContent}))")
            for item in groups:
                button = page.locator(f'[data-group="{item["id"]}"]')
                button.focus()
                page.keyboard.press("Enter")
                expect(page.locator("[data-capability-dialog]")).to_be_visible()
                expect(page.locator("[data-detail-title]")).to_have_text(item["title"])
                assert page.locator("[data-detail-fields] dt").count() == 4
                expect(page.locator("[data-close-detail]")).to_be_focused()
                page.keyboard.press("Tab")
                expect(page.locator("[data-close-detail]")).to_be_focused()
                if item["id"] == "render":
                    page.screenshot(path=str(out / f"detail-{width}.png"))
                page.keyboard.press("Escape")
                expect(page.locator("[data-capability-dialog]")).not_to_be_visible()
                expect(button).to_be_focused()
                page.wait_for_function("!location.hash.startsWith('#group-')")
            for chain in ["content", "code", "visit"]:
                button = page.locator(f'[data-chain="{chain}"]')
                button.focus()
                page.keyboard.press("Space")
                expect(button).to_have_attribute("aria-pressed", "true")
                assert page.locator("[data-group].is-highlighted").count() > 0
                assert page.locator("[data-relation].is-highlighted").count() > 0
                assert page.locator("[data-group].is-muted").count() > 0
                if chain == "code":
                    expect(page.locator("[data-chain-description]")).to_contain_text("页面直接使用 ZDS")
                if chain == "visit":
                    assert "is-highlighted" in page.locator("[data-external]").get_attribute("class")
                page.evaluate("scrollTo(0,0)")
                page.screenshot(path=str(out / f"chain-{chain}-{width}.png"), full_page=True)
                page.reload(wait_until="networkidle")
                expect(page.locator(f'[data-chain="{chain}"]')).to_have_attribute("aria-pressed", "true")
            page.locator('[data-chain="all"]').click()
            assert page.locator(".ov-root .is-muted").count() == 0
            for suffix, title in [
                ("?view=deployment#module-domain-sites", "站点与素材管理"),
                ("?view=dependencies#module-experience-zds", "基础组件"),
                ("?view=data#module-infra-storage", "数据库与文件存储"),
                ("#module-usecase-publish", "预览与发布"),
                ("#group-render", "页面渲染"),
            ]:
                page.goto(base + "/architecture.html" + suffix, wait_until="networkidle")
                expect(page.locator("[data-detail-title]")).to_have_text(title)
                assert "view=" not in page.url
                page.locator("[data-close-detail]").click()
            page.goto(base + "/architecture.html?view=unknown&chain=unknown#module-unknown", wait_until="networkidle")
            assert not page.locator("[data-capability-dialog]").evaluate("(e) => e.open")
            expect(page.locator('[data-chain="all"]')).to_have_attribute("aria-pressed", "true")
            assert "view=" not in page.url and "chain=" not in page.url and "#" not in page.url
            page.evaluate("location.hash='group-components'")
            expect(page.locator("[data-detail-title]")).to_have_text("基础组件")
            page.keyboard.press("Escape")
            page.locator(".architecture-more a").click()
            page.wait_for_url("**/architecture-reference.html")
            expect(page.get_by_role("heading", name="实现与演进资料", exact=True)).to_be_visible()
            assert page.locator(".ap-inventory").count() == 1
            assert page.locator("[data-band]").count() == 0
            assert not errors, errors
            assert not failed, failed
            results.append({"base": base, "width": width, "groups": len(groups), "chains": 3, "keyboard": "passed", "legacy_urls": "passed", "errors": errors, "failed_resources": failed})
            page.close()
    browser.close()
(out / "results.json").write_text(json.dumps(results, ensure_ascii=False, indent=2))
print(json.dumps(results, ensure_ascii=False, indent=2))
