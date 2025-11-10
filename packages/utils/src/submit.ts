/**
 * 提交一个 HTMLFormElement。
 * 优先使用原生的 requestSubmit；在不支持时回退到创建临时按钮点击。
 */
export function submit(form: HTMLFormElement): void {
  if (!form) return;
  // 现代浏览器支持
  if (typeof (form as HTMLFormElement).requestSubmit === 'function') {
    form.requestSubmit();
    return;
  }

  // 旧浏览器回退方案：创建一个隐藏的提交按钮并触发点击
  const button = document.createElement('button');
  button.type = 'submit';
  button.style.display = 'none';
  form.appendChild(button);
  try {
    button.click();
  } finally {
    form.removeChild(button);
  }
}