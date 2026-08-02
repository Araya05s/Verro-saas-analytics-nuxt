// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    files: ['**/*.{ts,vue}'],
    extends: [
      ...tseslint.configs.recommended,
      ...pluginVue.configs['flat/recommended'],
    ],
    languageOptions: {
      parserOptions: {
        // Crucial: Vue parser must handle the file, then hand scripts to TS
        parser: tseslint.parser, 
        sourceType: 'module',
      },
    },
  }
)
