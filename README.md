# grunt-eslint-config

[![Latest version](https://img.shields.io/npm/v/grunt-eslint-config)
 ![Dependency status](https://img.shields.io/librariesio/release/npm/grunt-eslint-config)
](https://www.npmjs.com/package/grunt-eslint-config)
[![Coverage](https://codecov.io/gh/prantlf/grunt-eslint-config/branch/master/graph/badge.svg)](https://codecov.io/gh/prantlf/grunt-eslint-config)

Loads [`.eslintrc.js`] or [`.eslintignore`] for being used as the options of [`grunt-eslint`]. Helps keeping the configuration at a single place.

See [grunt-eslintignore] for reusing just `eslintignore`.

## How It Works

Let's say that you let all JavaScript files in your project checked as simply as possible by `eslint '**/*.js'`. You'll use `.eslintrc.js` or `.eslintignore` to exclude generated files and build tools. This setup allows using IDE extensions with [`eslint`]. However, if you use [`grunt`] for building your project, you'll find that `grunt-eslint` doesn't use ignore patterns from `.eslintrc.js` or `.eslintignore`. You'd have to duplicate the ignored patterns in the [`Gruntfile`], when specifying the file patterns to check. You'll be able to reuse `.eslintrc.js` or `.eslintignore` , when configuring the `eslint` task:

```js
const { readEslintConfigFileSync } = require('grunt-eslint-config')

module.exports = grunt => {
  grunt.initConfig({
    eslint: readEslintConfigFileSync()
  })

  grunt.loadNpmTasks('grunt-eslint')
  grunt.registerTask('default', ['eslint'])
}
```

The contents of `.eslintrc.js`, for example:

```
module.exports = {
  extends: ['eslint:recommended'],
  parserOptions: { ecmaVersion: 'latest' },
  env: { node: true }
}
```

The contents of `.eslintignore`, for example:

```
dist/
node_modules/
```

The options returned by `readEslintConfigFileSync` are ready to be used for `grunt-eslint`, for example:

```json
{
  "options": { "overrideConfigFile": ".eslintrc.js" },
  "validate": [
    "**/*.{js,cjs,mjs}",
    "!dist/**/*",
    "!node_modules/**/*"
  ]
}
```

Alternatively, you can set the ignore patterns to the [`ignorePatterns`] property in `.eslintrc.js` instead of supplying `eslintignore`.

## Installation

This module can be installed in your project using [NPM], [PNPM] or [Yarn]. Make sure, that you use [Node.js] version 16 or newer.

```sh
$ npm i grunt grunt-eslint@^24 grunt-eslint-config
$ pnpm i grunt grunt-eslint@^24 grunt-eslint-config
$ yarn add grunt grunt-eslint@^24 grunt-eslint-config
```

Files `.eslintignore` and the traditional `.eslintrc.js` were deprecated in `eslint` 9. If you use them, you probably pin `eslint` to ^8 and `grunt-eslint` to ^24.

## API

```ts
interface ReadEslintConfigOptions {
  // Override the default configuration file name (`.eslintrc.{js,cjs,mjs}`).
  configFileName?: string

  // Override the default pattern for validating scripts (`['**/*.{js,cjs,mjs}']`).
  scriptFiles?: string[]

  // Override the default file name (`.eslintignore`).
  ignoreFileName?: string

  // Override the default current working directory (returned by `process.cwd()`).
  currentWorkingDir?: string

  // The root directory of the current project. It's the directory with `package.json`,
  // where `.eslintignore` is expected. It can be an absolute path or a path relative
  // to `currentWorkingDir`.
  //
  // If this property isn't set, the project directory will be looked by traversing
  // the current working directory and its ancestors until `package.json` is found.
  // The check for `package.json` and going up wil be repeated on `maxDepthToRoot` times.
  projectRootDir?: string

  // The root directory of the current project. It's the directory with `package.json`,
  // where `.eslintignore` is expected. It can be an absolute path or a path relative
  // to `currentWorkingDir`.
  // 
  // How many times will `package.json` be looked up and if not found,
  // go up to the parent directory. The default value is `10`.
  maxDepthToRoot?: number
}

// An object to be used as options for the grunt task `eslint`.
interface GruntEslintOptions {
  options: { overrideConfigFile: string },
  validate: string[]
}

// Reads the contents of `.eslintrc.{js,cjs,mjs}` and returns an object with options
// for the `grunt-eslint` task. If no config file is found, an error will be thrown.
//
// options: see `ReadEslintConfigOptions`
// returns: see `GruntEslintOptions`
function readEslintConfigFile(options?: ReadEslintConfigOptions): Promise<GruntEslintOptions>

// Reads the contents of `.eslintrc.{js,cjs,mjs}` and returns an object with options
// for the `grunt-eslint` task. If no config file is found, an error will be thrown.
//
// options: see `ReadEslintConfigOptions`
// returns: see `GruntEslintOptions`
function readEslintConfigFileSync(options?: ReadEslintConfigOptions): GruntEslintOptions
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.  Add unit tests for any new or changed functionality. Lint and test your code using Grunt.

## License

Copyright (c) 2024 Ferdinand Prantl

Licensed under the MIT license.

[Node.js]: http://nodejs.org/
[NPM]: https://www.npmjs.com/
[PNPM]: https://pnpm.io/
[Yarn]: https://yarnpkg.com/
[grunt-eslintignore]: https://github.com/prantlf/grunt-eslintignore
[`.eslintrc.js`]: https://eslint.org/docs/v8.x/use/configure/configuration-files
[`.eslintignore`]: https://eslint.org/docs/latest/use/configure/ignore-deprecated#the-eslintignore-file
[`ignorePatterns`]: https://eslint.org/docs/latest/use/configure/ignore-deprecated#ignorepatterns-in-config-files
[`grunt-eslint`]: https://github.com/sindresorhus/grunt-eslint/tree/v24.3.0
[`eslint`]: https://eslint.org/docs/v8.x/
[`grunt`]: https://gruntjs.com/
[`Gruntfile`]: https://gruntjs.com/sample-gruntfile
