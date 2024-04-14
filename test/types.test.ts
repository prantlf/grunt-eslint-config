import {
  readEslintConfigFile, readEslintConfigFileSync, ReadEslintConfigOptions,
  GruntEslintOptions
} from '../lib/index.js'

type testCallback = () => void
declare function test (label: string, callback: testCallback): void

test('Type declarations for TypeScript', async () => {
  const options: ReadEslintConfigOptions = {
    configFileName: 'eslint.confitg.js',
    scriptFiles: ['**/*.{js,cjs,mjs}'],
    ignoreFileName: '.eslintignore',
    currentWorkingDir: '.',
    projectRootDir: '.',
    maxDepthToRoot: 10
  }
  let config: GruntEslintOptions = await readEslintConfigFile()
  config = await readEslintConfigFile({})
  config = await readEslintConfigFile({ configFileName: 'eslint.confitg.js' })
  config = await readEslintConfigFile({ scriptFiles: ['**/*.{js,cjs,mjs}'] })
  config = await readEslintConfigFile({ ignoreFileName: '.eslintignore' })
  config = await readEslintConfigFile({ currentWorkingDir: '.' })
  config = await readEslintConfigFile({ projectRootDir: '.' })
  config = await readEslintConfigFile({ maxDepthToRoot: 10 })
  config = await readEslintConfigFile(options)
  config = readEslintConfigFileSync()
  config = readEslintConfigFileSync({})
  config = readEslintConfigFileSync({ configFileName: 'eslint.confitg.js' })
  config = readEslintConfigFileSync({ scriptFiles: ['**/*.{js,cjs,mjs}'] })
  config = readEslintConfigFileSync({ ignoreFileName: '.eslintignore' })
  config = readEslintConfigFileSync({ currentWorkingDir: '.' })
  config = readEslintConfigFileSync({ projectRootDir: '.' })
  config = readEslintConfigFileSync({ maxDepthToRoot: 10 })
  config = readEslintConfigFileSync(options)
})
