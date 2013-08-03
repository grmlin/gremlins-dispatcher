/*jshint camelcase:false */
module.exports = function (grunt) {
  'use strict';

  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');

  //
  // Grunt configuration:
  //
  //
  grunt.initConfig({
    coffee: {
      extension: {
        options: {
          bare: false,
          sourceMap: true
        },
        files: {
          'dist/gremlin.interests.js': ['src/Interests.coffee']
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */',
        compress: true,
        report: 'gzip',
        wrap: false
      },
      dist: {
        files: {
          'dist/gremlin.interests.min.js': ['dist/gremlin.interests.js']
        }
      }
    },
    clean: {
      extension: ["dist/*"]
    },
    pkg: grunt.file.readJSON('package.json')
  });


  // Create shortcuts to main operations.
  //grunt.registerTask('server', ['docs', 'connect:gremlinjs', 'watch:docs']);

  // the default task, when 'grunt' is executed with no options.
  grunt.registerTask('default', ['clean', 'coffee', 'uglify']);

};

