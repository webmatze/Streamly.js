module.exports = function(grunt) {
    "use strict";

    require('load-grunt-tasks')(grunt);

    var banner =
        '/*!\n<%= pkg.name %>.js - v<%= pkg.version %>\n' +
            'Created by <%= pkg.author %> on <%=grunt.template.today("yyyy-mm-dd") %>.\n\n' +
            '<%= pkg.repository.url %>\n\n' +
            '<%= license %> \n' +
            '*/';
    var minBanner = '/*! <%= pkg.name %>.js - v<%= pkg.version %> - by <%= pkg.author %> ' +
        '<%= grunt.template.today("yyyy-mm-dd") %> */';


    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        license: grunt.file.read("LICENSE"),
        srcDir: "src",
        testDir: "test",
        distDir: "dist",

        clean: [ "<%= distDir %>" ],

        uglify: {
            options: {
                banner: minBanner
            },

            dev: {
                files: {
                    "<%= distDir %>/<%= pkg.name %>.min.js": "<%= srcDir %>/<%= pkg.name %>.js"
                }
            }
        },

        concat: {
            dist: {
                options: {
                    banner: banner + "\n\n"
                },
                files: {
                    "<%= distDir %>/<%= pkg.name %>.js": "<%= srcDir %>/<%= pkg.name %>.js"
                }
            }
        },

        jshint: {
            options: {
                jshintrc: true
            },

            lib: ["<%= srcDir %>/**/*.js"],
            test: ["<%= testDir %>/**/*.spec.js"]
        },

        karma: {
            options: {
                configFile: "<%= testDir %>/karma.conf.js",
                autoWatch: false
            },

            unit: {
                background: true,
                singleRun: false
            },

            continous: {
                singleRun: true
            }
        },

        watch: {
            lib: {
                files: ["<%= srcDir %>/**/*.js", "<%= testDir %>/**/*.spec.js"],
                tasks: ["karma:unit:run", "jshint"]
            }
        },

        connect: {
            lib: {
                options: {
                    port: 8000
                }

            }
        }
    });

    grunt.registerTask("dev", ["connect", "karma:unit", "watch"]);
    grunt.registerTask("test", ["karma:continous"]);
    grunt.registerTask("dist", ["clean", "uglify", "concat", "karma:unit", "jshint"]);
};