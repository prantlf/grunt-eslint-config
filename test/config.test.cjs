const test = require('tehanu')(__filename)
const { deepStrictEqual, strictEqual } = require('assert')
const { join } = require('path')
const { readEslintConfigFile, readEslintConfigFileSync } = require('../lib/index.cjs')

test('exports named functions', () => {
  strictEqual(typeof readEslintConfigFile, 'function')
  strictEqual(typeof readEslintConfigFileSync, 'function')
})

function checkConfig(config, configFileName) {
  deepStrictEqual(config, {
    options: { overrideConfigFile: join(process.cwd(), configFileName) },
    validate: [
      '**/*.{js,cjs,mjs}',
      '!lib/index.cjs',
      '!lib/config-cjs.js',
      '!node_modules/**/*'
    ]
  })
}

test('readEslintConfigFile works in the project root', async () => {
  const config = await readEslintConfigFile({ configFileName: '.eslintrc.cjs' })
  checkConfig(config, '.eslintrc.cjs')
})

test('readEslintConfigFileSync works in the project root', () => {
  const config = readEslintConfigFileSync({ configFileName: '.eslintrc.cjs' })
  checkConfig(config, '.eslintrc.cjs')
})
