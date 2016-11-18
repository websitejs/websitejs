/// <reference path="../../typings/index.d.ts" />

'use strict';

var config = require('../../gulp.json'),
    gulp = require('gulp'),
    del = require('del'),
    rename = require('gulp-rename'),
    cache = require('gulp-cached'),
    remember = require('gulp-remember'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    cssGlob = require('gulp-css-globbing'),
    sassdoc = require('sassdoc');

module.exports = function() {
    
    // paths
    var srcGlob = config.paths.src + config.paths.scss.src + '/styles.scss',
        dest = config.paths.dest + config.paths.scss.dest,
        docs = config.paths.dest + config.paths.scss.docs,
        cacheName = 'sassFiles';

    gulp.add('sass:build', function(done) {

        // cleanup
        del.sync([dest + '*.css']);

        // build
        gulp.src(srcGlob)
            .pipe(cache(cacheName)) // only process changed files
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
            .pipe(remember(cacheName)) // add back all files to the stream
            .pipe(rename({ 
                suffix: '.min' 
            }))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(dest));

        done();
    });

    gulp.add('sass:watch', function() {
        var watcher = gulp.watch(srcGlob, ['sass:build']);
        watcher.on('change', function(e) {
            if (e.type === 'deleted') {
                delete cache.caches[cacheName][e.path];
                remember.forget(cacheName, e.path);
            }
        });
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

    gulp.add('sass:reset', function(done) {
        delete cache.caches[cacheName];
        remember.forgetAll(cacheName);
        done();
    });
};