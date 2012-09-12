module.exports =
  library:
    join: 'underscore-awesomer.js'
    compress: true
    files: 'src/**/*.coffee'
    _build:
      commands: [
        'cp underscore-awesomer.js packages/npm/underscore-awesomer.js'
        'cp underscore-awesomer.min.js packages/npm/underscore-awesomer.min.js'
        'cp README.md packages/npm/README.md'
        'cp underscore-awesomer.js packages/nuget/Content/Scripts/underscore-awesomer.js'
        'cp underscore-awesomer.min.js packages/nuget/Content/Scripts/underscore-awesomer.min.js'
      ]

  tests:
    _build:
      commands: [
        'mbundle test/packaging/bundle-config.coffee'
        'mbundle test/lodash/bundle-config.coffee'
      ]
    _test:
      command: 'phantomjs'
      runner: 'phantomjs-qunit-runner.js'
      files: '**/*.html'
      directories: [
        'test/core'
        'test/packaging'
        'test/lodash'
      ]

  _postinstall:
    commands: [
      'cp underscore vendor/underscore-latest.js'
    ]