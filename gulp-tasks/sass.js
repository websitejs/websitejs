/// <reference path="../typings/index.d.ts" />

'use strict';

var config = require('../config.json'),
    gulp = require('gulp'),
    del = require('del'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    cssGlob = require('gulp-css-globbing'),
    sassdoc = require('sassdoc');

module.exports = function() {
    
    // paths
    var srcGlob = config.paths.src + config.paths.scss.src + '/styles.scss',
        dest = config.paths.dest + config.paths.scss.dest,
        docs = config.paths.dest + config.paths.scss.docs;

    gulp.add('sass:build', function(done) {

        // cleanup
        del.sync([dest + '*.css']);

        // build
        gulp.src(srcGlob)
            .pipe(sourcemaps.init())
            .pipe(cssGlob({
                extensions: ['.scss']
            }))
            .pipe(sass({
                outputStyle: 'compressed',
                defaultEncoding: 'utf-8',
                unixNewlines: false,
                errLogToConsole: true,
                stopOnError: false,
                cacheLocation: config.paths.src + '.sass-cache/',
                precision: 4
            }).on('error', sass.logError))
            .pipe(autoprefixer({
                browsers: ['> 5%', 'IE 11', 'last 3 version'], 
                cascade: false
            }))
            .pipe(rename({ 
                suffix: '.min' 
            }))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(dest));

        done();
    });

    gulp.add('sass:watch', function() {
        gulp.watch(config.paths.src + '/**/*.scss', ['sass:build', 'server:reload']);
    });

    gulp.add('sass:docs', function(done) {
        gulp.src(srcGlob)
            .pipe(sassdoc({
                package: './package.json',
                dest: docs
            }))
            .resume();
        done();
    });
};