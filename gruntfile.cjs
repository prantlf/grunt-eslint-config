const { readEslintConfigFileSync } = require('./lib/index.cjs')

module.exports = grunt => {
  grunt.initConfig({
    eslint: readEslintConfigFileSync()
  })

  grunt.loadNpmTasks('grunt-eslint')
  grunt.registerTask('default', ['eslint'])
}
