module.exports = function(grunt) {

    "use strict";
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
          files: ['<%= jshint.files %>'],
          tasks: ['jshint']  // test file can be added here
        },

        browserify: {
            dist: {
                src: ['node_modules/jquery/dist/jquery.min.js', 'node_modules/leaflet/dist/leaflet.js', 'src/leafletEnvironmentalLayers.js', 'src/util/*.js'],
                dest: 'dist/LeafletEnvironmentalLayers.js'
            },
            babel: {
              files: {
                "dist/util/layersBrowser.js": "dist/util/layersBrowser_babel.js"
              }
            }
        },

        copy: {
          dist: {
            files: [
              {src: 'spec/javascripts/fixtures/layerData.json', dest: 'dist/layerData.json'},
            ],
          },
        },

        babel: {
          options: {
            sourceMap: true,
            presets: ['@babel/preset-env'],
            "plugins": [
              "transform-object-rest-spread",
              "transform-remove-strict-mode"
            ]        
          },
          dist: {
            files: {
              "dist/util/layersBrowser_babel.js": "src/util/layersBrowser.js",
              'dist/fracTrackerMobileLayer.js': 'src/fracTrackerMobileLayer.js'
            }
          }
        },

        jasmine: {
          src: ['dist/LeafletEnvironmentalLayers.js',
                'src/util/embedControl.js',
                'dist/util/layersBrowser.js',
                'dist/fracTrackerMobileLayer.js'
              ],
          options: {
            specs: "spec/javascripts/*spec.js",
            vendor: [
            'node_modules/jquery/dist/jquery.js',
            'node_modules/jasmine-jquery/lib/jasmine-jquery.js',
            'node_modules/jasmine-ajax/lib/mock-ajax.js',
            'node_modules/leaflet-blurred-location/dist/Leaflet.BlurredLocation.js',
            'node_modules/leaflet/dist/leaflet.js',
            'node_modules/leaflet-blurred-location-display/dist/Leaflet.BlurredLocationDisplay.js'
            ],
            keepRunner: true,
            '--web-security' : false,
            '--local-to-remote-url-access' : true,
            '--ignore-ssl-errors' : true
          }
        },

        jshint: {
            // define the files to lint
          files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
            // configure JSHint (documented at http://www.jshint.com/docs/)
          options: {
            // more options here if you want to override JSHint defaults
            globals: {
             jQuery: true,
             console: true,
             module: true
            }
          }
        },


    });

    /* // Using matchdep instead of these .
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    */

    /* Default (development): Watch files and build on change. */
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks("grunt-contrib-jasmine");
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.registerTask("default", ["watch", "babel", "jasmine"]);
    grunt.registerTask('transpile', [ 'copy', 'babel', 'browserify:babel' ]);
    grunt.registerTask("test", ["jshint", "jasmine"]);
    grunt.registerTask('build', [
        'browserify:dist'
    ]);

};
