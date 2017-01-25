module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        connect: {
          dev: {
            port: 8000,
            host: '*'
          }
        },
        wiredep: {
            dev: {
                src: ['index.html']
            }
        },
        injector: {
            options: {
                addRootSlash: false
            },
            local_dependencies: {
                files: {
                    'index.html': ['src/**/*.js', 'src/**/*.css'],
                }
            }
        }
    });
    grunt.registerTask('default', ['wiredep:dev', 'injector', 'connect:dev']);

};
