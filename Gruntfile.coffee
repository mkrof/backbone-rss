module.exports = (grunt) ->
    
    JS_SRC = ['src/scripts/**/*.js', '!src/scripts/vendor/**']
    CSS_SRC = 'src/styles/**/*.styl'
    CSS_MAIN = 'src/styles/app.styl'
    CSS_DIST = 'dist/dist.css'

    grunt.initConfig
        jshint:
            options:
                curly: true
                eqeqeq: true
                immed: true
                latedef: true
                newcap: true
                noarg: true
                sub: true
                undef: true
                boss: true
                eqnull: true
                browser: true
                globals:
                    require: true
                    define: true
                    console: true
                    '_': true
                    '$': true
            files:
                src: JS_SRC
        
        stylus:
            options:
                compress: true
                'include css': true
            # Compile all .styl files to dist.css.
            compile:
                files: do ->
                    files = {}
                    files[CSS_DIST] = CSS_MAIN
                    files

        concat:
            css:
                src: ['node_modules/bootstrap-2.3.2/css/bootstrap.min.css', CSS_DIST]
                dest: CSS_DIST

        clean: ['dist']

        connect:
            server:
                options:
                    keepalive: true
                    port: 8888
                    base: 'dist'
            
        copy:
            api:
                expand: true
                src: 'api/**'
                dest: 'dist/'
            index:
                expand: true
                cwd: 'src/'
                src: 'index.html'
                dest: 'dist/'
            templates:
                expand: true
                cwd: 'src/'
                src: 'templates/**'
                dest: 'dist/'
            scripts:
                expand: true
                cwd: 'src/'
                src: 'scripts/**'
                dest: 'dist'
            vendor:
                expand: true
                flatten: true
                cwd: 'node_modules'
                src: [
                    'jquery/tmp/jquery.js'
                    'underscore/underscore.js'
                    'backbone/backbone.js'
                    'requirejs/require.js'
                    'requirejs-text/text.js'
                ]
                dest: 'dist/scripts/vendor/'

        delta:
            styles:
                files: CSS_SRC
                tasks: ['stylus', 'concat:css']
            scripts:
                files: JS_SRC
                tasks: ['jshint', 'copy:scripts']
            index:
                files: 'src/index.html'
                tasks: 'copy:index'
            templates:
                files: 'src/templates/**'
                tasks: 'copy:templates'

    grunt.loadNpmTasks task for task in [
        'grunt-contrib-clean'
        'grunt-contrib-concat'
        'grunt-contrib-connect'
        'grunt-contrib-copy'
        'grunt-contrib-jshint'
        'grunt-contrib-stylus'
        'grunt-contrib-watch'
    ]

    grunt.registerTask 'build', [
        'clean'
        'jshint'
        'stylus'
        'concat'
        'copy'
    ]

    grunt.renameTask 'watch', 'delta'
    grunt.registerTask 'watch', ['build', 'delta']

    grunt.registerTask 'default', ['build']
