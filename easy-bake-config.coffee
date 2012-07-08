module.exports =
  library:
    join: 'underscore-awesomer.js'
    compress: true
    files: 'src/**/*.coffee'
    modes:
      build:
        commands: [
          'cp underscore-awesomer.js packages/npm/underscore-awesomer.js'
          'cp underscore-awesomer.min.js packages/npm/underscore-awesomer.min.js'
          'cp underscore-awesomer.js packages/nuget/Content/Scripts/underscore-awesomer.js'
          'cp underscore-awesomer.min.js packages/nuget/Content/Scripts/underscore-awesomer.min.js'
        ]

  tests:
    output: 'build'
    directories: [
      'test/core'
      'test/packaging'
      'test/lodash'
    ]
    modes:
      build:
        bundles:
          'test/packaging/build/bundle-latest.js':
            underscore: 'underscore'
            'underscore-awesomer': 'underscore-awesomer.js'
          'test/packaging/build/bundle-legacy.js':
            underscore: 'vendor/underscore-1.2.1.js'
            'underscore-awesomer': 'underscore-awesomer.js'
          'test/lodash/build/bundle-lodash.js':
            lodash: 'vendor/lodash-0.3.2.js'
            'underscore-awesomer': 'underscore-awesomer.js'
        no_files_ok: [
          'test/packaging'
          'test/lodash'
        ]
      test:
        command: 'phantomjs'
        runner: 'phantomjs-qunit-runner.js'
        files: '**/*.html'

  postinstall:
    commands: [
      'cp underscore vendor/underscore-latest.js'
    ]