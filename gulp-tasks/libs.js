/// <reference path="../typings/index.d.ts" />

'use strict';

var config = require('../config.json'),
    gulp = require('gulp'),
    gulpUtil = require('gulp-util'),
    del = require('del'),
    rename = require('gulp-rename'),
    filter = require('gulp-filter'),
    uglify = require('gulp-uglify'),
    cssnano = require('gulp-cssnano'),
    concat = require('gulp-concat'),
    strip = require('gulp-strip-comments');

module.exports = function() {
    
    gulp.add('libs:build', function(done) {

        // cleanup
        del.sync([
            config.paths.dest + config.paths.scripts.dest + '/vendor/**/*.js',
            config.paths.dest + config.paths.scss.dest + '/vendor/**/*.css'
        ]);

        for (var lib in config.paths.libraries) {

            // filters
            var filterScripts = filter(['**/*.js', '**/*.min.js']),
                filterScriptsMin = filter(['**/*.js', '!**/*.min.js'], { restore: true }),
                filterStyles = filter(['*.css', '*.min.css']),
                filterStylesMin = filter(['*.css', '!*.min.css'], { restore: true });

            // build
            gulp.src(config.paths.libraries[lib])
                .pipe(filterScripts)
                .pipe(filterScriptsMin)
                .pipe(uglify({ 
                    mangle: false 
                }).on('error', gulpUtil.log))
                .pipe(filterScriptsMin.restore)
                .pipe(concat(lib + '.js')
                .on('error', gulpUtil.log))
                .pipe(strip())
                .pipe(rename({ 
                    suffix: '.min' 
                }))
                .pipe(gulp.dest(config.paths.dest + config.paths.scripts.dest + '/vendor'));

            gulp.src(config.paths.libraries[lib])  
                .pipe(filterStyles)
                .pipe(filterStylesMin)
                .pipe(cssnano({
                    zindex: false
                })
                .on('error', gulpUtil.log))
                .pipe(filterStylesMin.restore)
                .pipe(concat(lib + '.css')
                .on('error', gulpUtil.log))
                .pipe(rename({ 
                    suffix: '.min' 
                }))
                .pipe(gulp.dest(config.paths.dest + config.paths.scss.dest + '/vendor'));
        }

        done();
    });
};