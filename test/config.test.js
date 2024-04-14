import tehanu from 'tehanu'
import { join } from 'path'
import { deepStrictEqual, rejects, strictEqual, throws } from 'assert'
import { readEslintConfigFile, readEslintConfigFileSync } from '../lib/index.js'

const test = tehanu(import.meta.url)

test('exports named functions', () => {
  strictEqual(typeof readEslintConfigFile, 'function')
  strictEqual(typeof readEslintConfigFileSync, 'function')
})

function checkThisProjectConfig(config) {
  deepStrictEqual(config, {
    options: { overrideConfigFile: join(process.cwd(), '.eslintrc.cjs') },
    validate: [
      '**/*.{js,cjs,mjs}',
      '!lib/index.cjs',
      '!lib/config-cjs.js',
      '!node_modules/**/*'
    ]
  })
}

test('readEslintConfigFile works in this project', async () => {
  const config = await readEslintConfigFile()
  checkThisProjectConfig(config)
})

test('readEslintConfigFileSync works in this project', () => {
  const config = readEslintConfigFileSync()
  checkThisProjectConfig(config)
})

function checkRootConfig(config) {
  deepStrictEqual(config, {
    options: { overrideConfigFile: join(process.cwd(), 'test/root-with/.eslintrc.js') },
    validate: [
      '**/*.{js,cjs,mjs}',
      '!node_modules/**/*',
      '!src/ignore.js',
      'src/include.js'
    ]
  })
}

test('readEslintConfigFile works in the project root', async () => {
  const config = await readEslintConfigFile({
    currentWorkingDir: 'test/root-with',
    projectRootDir: `${process.cwd()}/test/root-with`
  })
  checkRootConfig(config)
})

test('readEslintConfigFileSync works in the project root', () => {
  const config = readEslintConfigFileSync({
    currentWorkingDir: 'test/root-with',
    projectRootDir: `${process.cwd()}/test/root-with`
  })
  checkRootConfig(config)
})

function checkSubdirectoryConfig(config) {
  deepStrictEqual(config, {
    options: { overrideConfigFile: join(process.cwd(), 'test/root-with/.eslintrc.js') },
    validate: [
      '../**/*.{js,cjs,mjs}',
      '!../node_modules/**/*',
      '!../src/ignore.js',
      '../src/include.js'
    ]
  })
}

test('readEslintConfigFile works in a subdirectory', async () => {
  const config = await readEslintConfigFile({
    currentWorkingDir: 'test/root-with/build',
    projectRootDir: `${process.cwd()}/test/root-with`
  })
  checkSubdirectoryConfig(config)
})

test('readEslintConfigFileSync works in a subdirectory', () => {
  const config = readEslintConfigFileSync({
    currentWorkingDir: 'test/root-with/build',
    projectRootDir: `${process.cwd()}/test/root-with`
  })
  checkSubdirectoryConfig(config)
})

function checkSubdirectoryWithBothConfig(config) {
  deepStrictEqual(config, {
    options: { overrideConfigFile: join(process.cwd(), 'test/root-with-both/.eslintrc.cjs') },
    validate: [
      '../**/*.{js,cjs,mjs}',
      '!../node_modules/**/*',
      '!../src/ignore.js',
      '../src/include.js'
    ]
  })
}

test('readEslintConfigFile works in a subdirectory and with .eslintignore', async () => {
  const config = await readEslintConfigFile({
    configFileName: '.eslintrc.cjs',
    currentWorkingDir: 'test/root-with-both/src',
    projectRootDir: `${process.cwd()}/test/root-with-both`
  })
  checkSubdirectoryWithBothConfig(config)
})

test('readEslintConfigFileSync works in a subdirectory and with .eslintignore', () => {
  const config = readEslintConfigFileSync({
    configFileName: '.eslintrc.cjs',
    currentWorkingDir: 'test/root-with-both/src',
    projectRootDir: `${process.cwd()}/test/root-with-both`
  })
  checkSubdirectoryWithBothConfig(config)
})

test('readEslintConfigFile with no config', async () => {
  rejects(() => readEslintConfigFile({
    currentWorkingDir: 'test/root-without',
    maxDepthToRoot: 1
  }))
})

test('readEslintConfigFileSync with no config', () => {
  throws(() => readEslintConfigFileSync({
    currentWorkingDir: 'test/root-without',
    maxDepthToRoot: 1
  }))
})

test('readEslintConfigFile with empty project', async () => {
  rejects(() => readEslintConfigFile({
    currentWorkingDir: 'test/root-empty',
    maxDepthToRoot: 1
  }))
})

test('readEslintConfigFileSync with empty project', () => {
  throws(() => readEslintConfigFileSync({
    currentWorkingDir: 'test/root-empty',
    maxDepthToRoot: 1
  }))
})
