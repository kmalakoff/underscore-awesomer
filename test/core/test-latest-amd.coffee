try
  require.config({
    paths:
      'underscore': "../../vendor/underscore-1.5.2",
      'underscore-awesomer': "../../underscore-awesomer"
    shim:
      underscore:
        exports: '_'
      'underscore-awesomer':
        deps: ['underscore']
  })

  # library and dependencies
  require ['underscore', 'underscore-awesomer', 'qunit_test_runner'], (_, __, runner) ->
    window._ = null # force each test to require dependencies synchronously
    require ['./test'], -> runner.start()