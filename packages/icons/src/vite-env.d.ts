/// <reference types="vite/client" />

interface ImportMeta {
  glob: {
    (pattern: string): Record<string, () => Promise<{ default: string }>>;
    /**
     * Vite特有的glob导入方法
     * @param pattern - 匹配模式
     * @param options - 配置选项
     */
    <T = unknown>(
      pattern: string,
      options: {
        query?: string | Record<string, string>;
        import?: string;
        eager?: boolean;
      }
    ): Record<string, T>;
  };
}