/// <reference path="../typings/index.d.ts" />

'use strict';

var config = require('../config.json'),
    gulp = require('gulp'),
    gulpUtil = require('gulp-util'),
    del = require('del'),
    rename = require('gulp-rename'),
    cache = require('gulp-cached'),
    remember = require('gulp-remember'),
    sourcemaps = require('gulp-sourcemaps'),
    jshint = require('gulp-jshint'),    
    concat = require('gulp-concat'),       
    uglify = require('gulp-uglify'),      
    jsdoc = require('gulp-jsdoc3');

module.exports = function() {
    
    // paths
    var fileName = config.paths.scripts.fileName,
        srcGlob = [
            config.paths.src + config.paths.elements.src + '/**/*.js',
            config.paths.src + config.paths.components.src + '/**/*.js',
            config.paths.src + config.paths.scripts.src + '/**/*.js',
            config.paths.src + '/' + fileName + '.js'
        ],
        dest = config.paths.dest + config.paths.scripts.dest,
        docs = config.paths.dest + config.paths.scripts.docs,
        cacheName = 'scriptFiles';

    gulp.add('scripts:build', function(done) {

        // cleanup
        del.sync([dest + '*.js']);

        // build
        gulp.src(srcGlob)
            .pipe(sourcemaps.init())
            .pipe(cache(cacheName)) // only process changed files
            .pipe(jshint())
            .pipe(jshint.reporter('jshint-stylish'))
            .pipe(remember(cacheName)) // add back all files to the stream
            .pipe(concat(fileName + '.js')
            .on('error', gulpUtil.log))
            .pipe(uglify({ 
                mangle: false 
            }).on('error', gulpUtil.log))
            .pipe(rename({ 
                suffix: '.min' 
            }))
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