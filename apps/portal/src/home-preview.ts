export function renderHomePreview() {
  return `<section class="home-preview" aria-labelledby="preview-title">
    <div class="home-preview__bar"><span class="preview-dots" aria-hidden="true"><i></i><i></i><i></i></span><span>页面示例：账户设置</span><span class="preview-live">可操作</span></div>
    <div class="home-preview__body example-preview">
      <div class="preview-heading"><div class="preview-avatar" aria-hidden="true">Z</div><div><h2 id="preview-title">账户设置</h2><p>管理个人资料与通知偏好</p></div></div>
      <label class="preview-label" for="preview-nick">昵称</label><input id="preview-nick" class="preview-input" value="Zone 用户" autocomplete="off" maxlength="60">
      <div class="preview-notifications"><div><h3>邮件通知</h3><p>接收重要更新和消息</p></div><zone-checkbox id="preview-mail" checked aria-label="邮件通知">开启</zone-checkbox></div>
      <div class="preview-save"><span id="preview-status" role="status">修改后点击保存</span><zone-button id="preview-save" size="large">保存设置</zone-button></div>
      <p class="preview-disclaimer">本页演示，不会修改真实账户</p>
    </div><p class="home-preview__caption">参考组件说明完成的页面，可直接操作。</p>
  </section>`;
}
export async function initHomePreview() {
  await customElements.whenDefined('zone-button');
  document.getElementById('preview-save')?.addEventListener('zone-click', () => {
    document.getElementById('preview-status')!.textContent = '演示设置已保存';
  });
}
