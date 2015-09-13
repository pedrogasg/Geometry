module.exports = function(grunt){
    grunt.initConfig({
        connect:{
            all: {
                options: {
                    port: 9000,
                    hostname: 'localhost',
                    base: 'app'
                }
            }
        },
        open: {
            all: {
                path: 'http://localhost:<%= connect.all.options.port%>'
            }
        },
        watch: {
            options: {
                livereload: true
            },
            js: {
                files: ['app/js/**/*.js'],
                    tasks: ['jshint']
            }
        }
    });
    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
        return grunt.task.run(['open', 'connect', 'watch']);
    });
}