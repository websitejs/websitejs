/// <reference path="../typings/index.d.ts" />

'use strict';

var config = require('../config.json'),
    pkg = require('../package.json'),
    gulp = require('gulp'),
    gulpUtil = require('gulp-util'),
    fs = require('fs'),
    path = require('path'),
    del = require('del'),
    cache = require('gulp-cached'),
    remember = require('gulp-remember'),
    nunjucksRender = require('gulp-nunjucks-render'),
    data = require('gulp-data');

module.exports = function() {
    
    // paths
    var srcGlob = [
            config.paths.src + '/**/*.html',
            '!' + config.paths.src + config.paths.styleguide.src + '/**/*.*'
        ],
        styleguideSrcGlob = [
            config.paths.src + config.paths.styleguide.src + '/**/*.html',
            '!' + config.paths.src + config.paths.styleguide.src + '/includes/*.*',
            '!' + config.paths.src + config.paths.styleguide.src + '/layout.html',
            '!' + config.paths.src + config.paths.styleguide.src + '/index.html'
        ],
        styleguideIndexGlob = [
            config.paths.src + config.paths.styleguide.src + '/index.html'
        ],
        dest = config.paths.dest + config.paths.styleguide.dest,
        cacheName = 'styleguideFiles';

    /**
     * returns data object with file info for elements/components
     * @param {object} file File to process
     * @returns {object} File data object
     * @private
     */
    function getDataForFile(file) {
        var type = path.relative('.', file.relative).split('\\')[0],
            name = path.basename(file.relative, '.html');

        return {
            paths: {
                css: config.paths.scss.dest,
                js: config.paths.scripts.dest,
                jsFilename: config.paths.scripts.fileName
            },
            meta: {
                title: config.name + " - " + type + " - " + name
            },
            name: name,
            type: type,
            extends: true
        };
    }

    /**
     * returns data object with info for pages
     * @param {object} file File to process
     * @returns {object} File data object
     * @private
     */
    function getDataForPage(file) {
        var name = path.basename(file.relative, '.html');

        return {
            paths: {
                css: config.paths.scss.dest,
                js: config.paths.scripts.dest,
                jsFilename: config.paths.scripts.fileName
            },
            meta: {
                title: config.name + " - " + name
            },
            //name: name,
            extends: false
        };
    }

    /**
     * returns data object for styleguide index
     * @param {object} file File to process
     * @returns {object} File data object
     * @private
     */
    function getDataForIndex(file) {
        return {
            paths: {
                css: config.paths.scss.dest,
                js: config.paths.scripts.dest,
                jsFilename: config.paths.scripts.fileName
            },
            meta: {
                title: config.name
            },
            project: {
                name: config.name,
                version: pkg.version
            },
            components: fs.readdirSync(config.paths.src + config.paths.components.src),
            elements: fs.readdirSync(config.paths.src + config.paths.elements.src),
            pages: fs.readdirSync(config.paths.src + config.paths.styleguide.src + '/pages')
        };
    }

    gulp.add('styleguide:build', function(done) {

        // cleanup
        del.sync([dest]);

        // get current components and elements
        gulp.src(srcGlob)
            .pipe(cache(cacheName)) // only process changed files
            .pipe(data(getDataForFile))
            .pipe(nunjucksRender({
                path: [config.paths.src]
            })
            .on('error', gulpUtil.log))
            .pipe(remember(cacheName)) // add back all files to the stream
            .pipe(gulp.dest(dest));

        // build styleguide pages
        gulp.src(styleguideSrcGlob)
            .pipe(cache(cacheName)) // only process changed files
            .pipe(data(getDataForPage))
            .pipe(nunjucksRender({
                path: [config.paths.src]
            })
            .on('error', gulpUtil.log))
            .pipe(remember(cacheName)) // add back all files to the stream
            .pipe(gulp.dest(dest));

        // build styleguide index
        gulp.src(styleguideIndexGlob)
            .pipe(cache(cacheName)) // only process changed files
            .pipe(data(getDataForIndex))
            .pipe(nunjucksRender({
                path: [config.paths.src]
            })
            .on('error', gulpUtil.log))
            .pipe(remember(cacheName)) // add back all files to the stream
            .pipe(gulp.dest(dest));

        done();
    });

    gulp.add('styleguide:watch', function() {
        var watcher = gulp.watch(srcGlob, ['styleguide:build', 'server:reload']),
            sgWatcher = gulp.watch(styleguideSrcGlob, ['styleguide:build', 'server:reload']),
            indexWatcher = gulp.watch(styleguideIndexGlob, ['styleguide:build', 'server:reload']);

        watcher.on('change', function(e) {
            if (e.type === 'deleted') {
                delete cache.caches[cacheName][e.path];
                remember.forget(cacheName, e.path);
            }
        });
        sgWatcher.on('change', function(e) {
            if (e.type === 'deleted') {
                delete cache.caches[cacheName][e.path];
                remember.forget(cacheName, e.path);
            }
        });
        indexWatcher.on('change', function(e) {
            if (e.type === 'deleted') {
                delete cache.caches[cacheName][e.path];
                remember.forget(cacheName, e.path);
            }
        });
    });

    gulp.add('styleguide:reset', function(done) {
        delete cache.caches[cacheName];
        remember.forgetAll(cacheName);
        done();
    });
};