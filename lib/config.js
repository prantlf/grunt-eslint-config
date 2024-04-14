import { existsSync } from 'fs'
import { isAbsolute, join, relative, resolve } from 'path'
import { exists, findProjectRootDir, findProjectRootDirSync, log, transFormIgnore } from './common.js'
import { readEslintIgnoreFile, readEslintIgnoreFileSync } from 'grunt-eslintignore'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

function computeDirsAndPaths(currentWorkingDir, projectRootDir) {
  log('initial current directory is %s', currentWorkingDir)
  const gruntFileDir = currentWorkingDir ? resolve(currentWorkingDir) : process.cwd()
  const configFileDir = isAbsolute(projectRootDir)
    ? projectRootDir
    : resolve(join(gruntFileDir, projectRootDir))
  const relativePathToRoot = relative(gruntFileDir, configFileDir).replaceAll('\\', '/')
  log('gruntfile directory is %s', gruntFileDir)
  log('config file directory is %s', configFileDir)
  log('relative path to root directory is %s', relativePathToRoot)
  return { configFileDir, relativePathToRoot }
}

const configFileNames = ['.eslintrc.js', '.eslintrc.cjs']

async function findConfigFile(configFileName, configFileDir) {
  if (configFileName) {
    log('checking config file %s', configFileName)
    const configFilePath = join(configFileDir, configFileName)
    if (await exists(configFilePath)) return configFilePath
  } else {
    for (configFileName of configFileNames) {
      log('trying config file %s', configFileName)
      const configFilePath = join(configFileDir, configFileName)
      if (await exists(configFilePath)) return configFilePath
    }
  }
  throw new Error('ESLint config file not found')
}

function findConfigFileSync(configFileName, configFileDir) {
  if (configFileName) {
    log('checking config file %s', configFileName)
    const configFilePath = join(configFileDir, configFileName)
    if (existsSync(configFilePath)) return configFilePath
  } else {
    for (configFileName of configFileNames) {
      log('trying config file %s', configFileName)
      const configFilePath = join(configFileDir, configFileName)
      if (existsSync(configFilePath)) return configFilePath
    }
  }
  throw new Error('ESLint config file not found')
}

function transformIgnores(relativePathToRoot, ignores) {
  log('transforming %d ignores to the path %s', ignores.length, relativePathToRoot)
  return ignores.map(ignore => transFormIgnore(ignore, relativePathToRoot))
}

function extractIgnores(config) {
  const ignores = config.ignorePatterns || []
  log('extracted %d ignores from config', ignores.length)
  return ignores
}

function transformConfig(configFilePath, relativePathToRoot, files, ignores) {
  return {
    options: { overrideConfigFile: configFilePath },
    validate: (files || [join(relativePathToRoot, '**/*.{js,cjs,mjs}')]).concat(ignores)
  }
}

export async function readEslintConfigFile({ configFileName, ignoreFileName, currentWorkingDir, projectRootDir, maxDepthToRoot, scriptFiles } = {}) {
  if (!projectRootDir) {
    projectRootDir = await findProjectRootDir(currentWorkingDir, maxDepthToRoot)
  }

  const { configFileDir, relativePathToRoot } = computeDirsAndPaths(currentWorkingDir, projectRootDir)
  const configFilePath = await findConfigFile(configFileName, configFileDir)

  log('importing %s', configFilePath)
  const config = require(configFilePath)
  let ignores = extractIgnores(config)
  ignores = ignores.length
    ? transformIgnores(relativePathToRoot, ignores)
    : await readEslintIgnoreFile({ ignoreFileName, currentWorkingDir, projectRootDir, maxDepthToRoot })

  return transformConfig(configFilePath, relativePathToRoot, scriptFiles, ignores)
}

export function readEslintConfigFileSync({ configFileName, ignoreFileName, currentWorkingDir, projectRootDir, maxDepthToRoot, scriptFiles } = {}) {
  if (!projectRootDir) {
    projectRootDir = findProjectRootDirSync(currentWorkingDir, maxDepthToRoot)
  }

  const { configFileDir, relativePathToRoot } = computeDirsAndPaths(currentWorkingDir, projectRootDir)
  const configFilePath = findConfigFileSync(configFileName, configFileDir)

  log('importing %s', configFilePath)
  const config = require(configFilePath)
  let ignores = extractIgnores(config)
  ignores = ignores.length
    ? transformIgnores(relativePathToRoot, ignores)
    : readEslintIgnoreFileSync({ ignoreFileName, currentWorkingDir, projectRootDir, maxDepthToRoot })

  return transformConfig(configFilePath, relativePathToRoot, scriptFiles, ignores)
}
