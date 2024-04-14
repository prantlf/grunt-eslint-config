import debug from 'debug'
import { existsSync } from 'fs'
import { access } from 'fs/promises'
import { join } from 'path'

export const log = debug('grunt-escf')

export async function exists(file) {
  try {
    log('checking existence of %s', file)
    await access(file)
    log('%s was found', file)
    return true
  /* c8 ignore next 4 */
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
    log('%s was not found', file)
  }
}

export async function findProjectRootDir(currentWorkingDir, maxDepthToRoot = 10) {
  let dir = currentWorkingDir || '.'
  for (let i = 0; i < maxDepthToRoot; ++i) {
    log('looking for package.json in %s', dir)
    if (await exists(join(dir, 'package.json'))) {
      log('package.json found in %s', dir)
      return dir
    }
    dir = join('..', dir)
  }
  log('package.json not found in %d parent directories', maxDepthToRoot)
  throw new Error('Project root not found')
}

export function findProjectRootDirSync(currentWorkingDir, maxDepthToRoot = 10) {
  let dir = currentWorkingDir || '.'
  for (let i = 0; i < maxDepthToRoot; ++i) {
    log('looking for package.json in %s', dir)
    if (existsSync(join(dir, 'package.json'))) {
      log('package.json found in %s', dir)
      return dir
    }
    dir = join('..', dir)
  }
  log('package.json not found in %d parent directories', maxDepthToRoot)
  throw new Error('Project root not found')
}

export function transFormIgnore(ignore, relativePathToRoot) {
  let newIgnore = ignore
  if (newIgnore.endsWith('/')) {
    newIgnore += '**/*'
  }
  newIgnore = newIgnore.startsWith('!')
    ? `${join(relativePathToRoot, newIgnore.slice(1))}`
    : `!${join(relativePathToRoot, newIgnore)}`
  log('transforming %s to %s', ignore, newIgnore)
  return newIgnore
}
