import { readFile, writeFile } from 'fs/promises'
import cleanup from 'rollup-plugin-cleanup'

const configJs = (await readFile('lib/config.js', 'utf8')).split(/\r?\n/)
configJs.splice(4, 3)
await writeFile('lib/config-cjs.js', configJs.join('\n'))

export default [
  {
    input: 'lib/index-cjs.js',
    output: [
      {
        file: 'lib/index.cjs',
        format: 'cjs',
        sourcemap: true
      }
    ],
    external: ['debug', 'fs', 'fs/promises', 'grunt-eslintignore', 'path'],
    plugins: [
      cleanup()
    ]
  }
]
