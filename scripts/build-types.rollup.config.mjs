import path from 'path'
import alias from '@rollup/plugin-alias'
import dts from 'rollup-plugin-dts'

export default {
  input: path.resolve(process.cwd(), 'src/index.ts'),
  output: {
    file: path.resolve(process.cwd(), 'dist/zone.d.ts'),
    format: 'es'
  },
  external: [/\.less$/, /^lit($|\/)/, /^@lit\//, /^@floating-ui\//],
  onwarn(warning, warn) {
    if (typeof warning?.message === 'string' && warning.message.includes('Ambiguous external namespace resolution')) return
    warn(warning)
  },
  plugins: [
    alias({
      entries: [
        { find: '@aiyazone/core', replacement: path.resolve(process.cwd(), 'packages/core/src/index.ts') },
        { find: '@aiyazone/icons', replacement: path.resolve(process.cwd(), 'packages/icons/src/index.ts') },
        { find: '@aiyazone/i18n', replacement: path.resolve(process.cwd(), 'packages/i18n/src/index.ts') },
        { find: '@aiyazone/utils', replacement: path.resolve(process.cwd(), 'packages/utils/src/index.ts') }
      ]
    }),
    dts({ tsconfig: path.resolve(process.cwd(), 'tsconfig.types.json'), respectExternal: true })
  ]
}
