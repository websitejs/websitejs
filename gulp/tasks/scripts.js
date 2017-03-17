'use strict';

var config = require('../../.project/.config'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    path = require('path'),
    del = require('del'),
    rename = require('gulp-rename'),
    cache = require('gulp-cached'),
    remember = require('gulp-remember'),
    sourcemaps = require('gulp-sourcemaps'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    //stripJs = require('gulp-strip-comments'),
    jsdoc = require('gulp-jsdoc3'),
    watch = require('gulp-watch'),
    notify = require('gulp-notify');

module.exports = function() {

    // paths
    var fileName = 'scripts',
        srcGlob = [
            config.srcJsPath + '/ComponentHandler.js',
            config.srcJsPath + '/base/**/*.js',
            config.srcElementsPath + '/**/*.js',
            config.srcComponentsPath + '/**/*.js',
            config.srcPath + '/' + config.scriptsFilename + '.js'
        ],
        dest = config.destJsPath,
        docs = config.destDocsPathJs,
        cacheName = 'scriptFiles';

    gulp.add('scripts:build', function(done) {

        // cleanup
        del.sync([dest + '*[.js,.js.map']);

        // build
        gulp.src(srcGlob)
            .pipe(plumber(function(error) {
                gutil.log(error.message);
                notify().write(error.message);
                this.emit('end');
            }))
            .pipe(sourcemaps.init())
            .pipe(cache(cacheName))
            .pipe(jshint())
            //.pipe(jshint.reporter('jshint-stylish'))
            .pipe(notify(function(file) {
                if (file.jshint.success) {
                    return false;
                }
                var errors = file.jshint.results.map(function(data) {
                    if (data.error) {
                        return 'line ' + data.error.line + ', col ' + data.error.character + ': ' + data.error.reason;
                    }
                }).join('\n');

                return file.relative + ' (' + file.jshint.results.length + ' errors)\n' + errors;
            }))
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
        watch(srcGlob, {
            read: false
        }, function(file) {
            gutil.log('>>> ' + path.relative(file.base, file.path) + ' (' + file.event + ').');
            if (file.event === 'unlink') {
                delete cache.caches[cacheName][file.path];
                remember.forget(cacheName, file.path);
            }
            gulp.start(['scripts:build', 'server:reload']);
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
