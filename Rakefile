require 'rubygems'
require 'closure-compiler'

HEADER = /((^\s*\/\/.*\n)+)/

desc "Use the Closure Compiler to compress Underscore-Awesomer.js"
task :build do
  source  = File.read('underscore-awesomer.js')
  header  = source.match(HEADER)
  min     = Closure::Compiler.new.compress(source)
  File.open('underscore-awesomer-min.js', 'w') do |file|
    file.write header[1].squeeze(' ') + min
  end
end

desc "Build the docco documentation"
task :doc do
  sh "docco underscore-awesomer.js"
end

desc "run JavaScriptLint on the source"
task :lint do
  system "jsl -nofilelisting -nologo -conf docs/jsl.conf -process underscore-awesomer.js"
end
