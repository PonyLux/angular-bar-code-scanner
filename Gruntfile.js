module.exports = function( grunt ) {

    'use strict';

    var FILE_PATH = 'src/';

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.initConfig({
        pkg    : grunt.file.readJSON('package.json'),
        banner : '/* \n * <%= pkg.name %> <%= pkg.version %>\n * <%= pkg.homepage %>\n * \n * Licensed under the <%= pkg.license %> license\n */',
        uglify : {
            production : {
                src: [ FILE_PATH + 'angular-bar-code-scanner.js' ],
                dest: 'angular-bar-code-scanner.min.js'
            }
        },
        concat : {
            production: {
                src: [FILE_PATH + 'barCodeScanner-module.js', FILE_PATH + 'barCodeScanner-directive.js'],
                dest: FILE_PATH + 'angular-bar-code-scanner.js'
            }
        },
        copy : {
            production : {
                files : [
                    { src: FILE_PATH + 'angular-bar-code-scanner.js', dest : 'angular-bar-code-scanner.js' },
                    { src: FILE_PATH + 'angular-bar-code-scanner.min.js', dest : 'angular-bar-code-scanner.min.js' }
                ]
            }
        }
    });

    grunt.registerTask('default', ['build']);
    grunt.registerTask('build', ['concat', 'uglify', 'copy']);
};