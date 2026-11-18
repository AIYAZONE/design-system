export const aiInstruction = `请使用 AIYAZONE 设计系统制作一个【写下页面需求】。
先阅读 https://design.aiyazone.com/llms.txt。
需要组件细节时，继续阅读其中链接的完整说明。
使用说明中已有的组件、图标和样式变量。
没有现成组件的部分请说明，不要编造组件属性或事件。
输出可运行页面，并告诉我如何打开。
完成后检查按钮、表单、键盘操作和手机布局。`;
export async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; }
  catch {
    const input = document.createElement('textarea');
    input.value = text;
    input.style.cssText = 'position:fixed;left:-9999px';
    document.body.append(input);
    input.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch { /* 手动复制反馈由调用方提供 */ }
    input.remove();
    return copied;
  }
}
const boundButtons = new WeakSet();
export function bindCopy(root = document) {
  root.querySelectorAll('[data-copy-target]').forEach((button) => {
    if (boundButtons.has(button)) return;
    boundButtons.add(button);
    button.addEventListener('click', async () => {
      const target = document.getElementById(button.dataset.copyTarget);
      const original = button.textContent;
      button.disabled = true;
      const copied = await copyText(target?.textContent || '');
      button.textContent = copied ? '已复制' : '复制失败，请手动复制';
      button.disabled = false;
      if (!copied && target) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(target);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      setTimeout(() => { button.textContent = original; }, 2400);
    });
  });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => bindCopy(), { once: true });
else bindCopy();
