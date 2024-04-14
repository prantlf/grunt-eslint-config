import { ReadEslintIgnoreOptions } from 'grunt-eslintignore'

export interface ReadEslintConfigOptions extends ReadEslintIgnoreOptions {
  /**
   * Override the default configuration file name (`.eslintrc.{js,cjs,mjs}`).
   */
  configFileName?: string

  /**
   * Override the default pattern for validating scripts (`['** / *.{js,cjs,mjs}']`).
   */
  scriptFiles?: string[]
}

/**
 * An object to be used as options for the grunt task `eslint`.
 */
export interface GruntEslintOptions {
  options: { overrideConfigFile: string },
  validate: string[]
}

/**
 * Reads the contents of `.eslintrc.{js,cjs,mjs}` and returns an object with options
 * for the `grunt-eslint` task. If no config file is found, an error will be thrown.
 * 
 * @param options see `ReadEslintConfigOptions`
 * @returns see `GruntEslintOptions`
 */
export function readEslintConfigFile(options?: ReadEslintConfigOptions): Promise<GruntEslintOptions>

/**
 * Reads the contents of `.eslintrc.{js,cjs,mjs}` and returns an object with options
 * for the grunt task `eslint`. If no config file is found, an error will be thrown.
 * 
 * @param options see `ReadEslintConfigOptions`
 * @returns see `GruntEslintOptions`
 */
export function readEslintConfigFileSync(options?: ReadEslintConfigOptions): GruntEslintOptions
