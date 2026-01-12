declare module '*.less?inline' {
  const css: string;
  export default css;
}

declare module '*.css?inline' {
  const css: string;
  export default css;
}

declare module '*.less' {
  const content: string;
  export default content;
}
