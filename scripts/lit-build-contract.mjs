export const isLitImport = id => /^(?:lit|lit-html|lit-element|@lit\/[^/]+)(?:$|\/)/.test(id);

export const litBuildContract = (bundled = false) => ({
  name: 'lit-build-contract',
  generateBundle(_options, bundle) {
    const chunks = Object.values(bundle).filter(file => file.type === 'chunk');
    const litModules = chunks.flatMap(chunk => Object.keys(chunk.modules))
      .filter(id => /[/\\]node_modules[/\\](?:lit|lit-html|lit-element|@lit[/\\][^/\\]+)[/\\]/.test(id));
    if (!bundled && litModules.length) this.error(`npm 产物内嵌了 Lit：${litModules.join(', ')}`);
    if (bundled && !litModules.length) this.error('CDN 产物缺少 Lit 运行时');
    if (bundled && chunks.some(chunk => chunk.imports.length || chunk.dynamicImports.length)) {
      this.error('CDN 必须自包含，不能引用其他 JS 模块');
    }
    console.log(`Lit 构建契约：${bundled ? 'CDN 自包含' : 'npm 共享'}，内嵌 ${litModules.length} 个 Lit 模块。`);
  }
});
