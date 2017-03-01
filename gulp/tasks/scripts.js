'use strict';

var config = require('../config'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    del = require('del'),
    rename = require('gulp-rename'),
    cache = require('gulp-cached'),
    remember = require('gulp-remember'),
    sourcemaps = require('gulp-sourcemaps'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    stripJs = require('gulp-strip-comments'),
    jsdoc = require('gulp-jsdoc3');

module.exports = function() {

    // paths
    var fileName = 'scripts',
        srcGlob = [
            config.srcPath + '/js/**/*.js',
            config.srcPath + '/elements/**/*.js',
            config.srcPath + '/components/**/*.js',
            config.srcPath + '/' + fileName + '.js'
        ],
        dest = config.destPath + '/js',
        docs = config.destPath + '/docs/script',
        cacheName = 'scriptFiles';

    gulp.add('scripts:build', function(done) {

        // cleanup
        del.sync([dest + '*[.js,.js.map']);

        // build
        gulp.src(srcGlob)
            .pipe(plumber(function(error) {
                gutil.log(error.message);
                this.emit('end');
            }))
            .pipe(sourcemaps.init())
            .pipe(cache(cacheName))
            .pipe(jshint())
            .pipe(jshint.reporter('jshint-stylish'))
            .pipe(remember(cacheName))
            .pipe(uglify({ mangle: false }))
            .pipe(concat(fileName + '.js'))
            .pipe(rename({ suffix: '.min' }))
            //.pipe(stripJs())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(dest));
        done();
    });

    gulp.add('scripts:watch', function() {

        var watcher = gulp.watch(srcGlob, ['scripts:build', 'server:reload']);
        watcher.on('change', function(e) {
            if (e.type === 'deleted') {
                delete cache.caches[cacheName][e.path];
                remember.forget(cacheName, e.path);
            }
        });
    });

    gulp.add('scripts:docs', function(done) {

        var cfg = {
            "tags": {
                "allowUnknownTags": true
            },
            "opts": {
                "destination": docs
            },
            "plugins": [
                "plugins/markdown"
            ],
            "templates": {
                "cleverLinks": false,
                "monospaceLinks": false,
                "default": {
                    "outputSourceFiles": true
                },
                "path": "ink-docstrap",
                "theme": "cerulean",
                "navType": "vertical",
                "linenums": true,
                "dateFormat": "MMMM Do YYYY, h:mm:ss a"
            }
        };

        // add readme
        srcGlob.unshift('./README.md');

        gulp.src(srcGlob, {
            read: false
        })
        .pipe(jsdoc(cfg, done));
    });

    gulp.add('scripts:reset', function(done) {
        delete cache.caches[cacheName];
        remember.forgetAll(cacheName);
        done();
    });
};
