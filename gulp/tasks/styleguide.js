'use strict';

var config = require('../config'),
    pkg = require('../../package.json'),
    bs = require('bootstrap-sass/package.json'),
    jq = require('jquery/package.json'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
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
            config.srcPath + '/**/*.html',
            '!' + config.srcPath + '/styleguide/**/*.*'
        ],
        styleguideSrcGlob = [
            config.srcPath + '/styleguide/**/*.html',
            '!' + config.srcPath + '/styleguide/includes/*.*',
            '!' + config.srcPath + '/styleguide/layout.html',
            '!' + config.srcPath + '/styleguide/index.html'
        ],
        styleguideIndexGlob = [
            config.srcPath + '/styleguide/index.html'
        ],
        dest = config.destPath + '/styleguide',
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
                css: '/css',
                js: '/js',
                jsFilename: 'scripts'
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
                css: '/css',
                js: '/js',
                jsFilename: 'scripts'
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
                css: '/css',
                js: '/js',
                jsFilename: 'scripts'
            },
            meta: {
                title: config.name
            },
            project: {
                name: config.name,
                version: pkg.version,
                bsversion: bs.version,
                jqversion: jq.version
            },
            components: fs.readdirSync(config.srcPath + '/components'),
            elements: fs.readdirSync(config.srcPath + '/elements'),
            pages: fs.readdirSync(config.srcPath + '/styleguide/pages')
        };
    }

    gulp.add('styleguide:build', function(done) {

        // cleanup
        del.sync([dest]);

        // get current components and elements
        gulp.src(srcGlob)
            .pipe(plumber(function(error) {
                gutil.log(error.message);
                this.emit('end');
            }))
            .pipe(cache(cacheName))
            .pipe(data(getDataForFile))
            .pipe(nunjucksRender({ path: [config.srcPath] }))
            .pipe(remember(cacheName))
            .pipe(gulp.dest(dest));

        // build styleguide pages
        gulp.src(styleguideSrcGlob)
            .pipe(plumber(function(error) {
                gutil.log(error.message);
                this.emit('end');
            }))
            .pipe(cache(cacheName))
            .pipe(data(getDataForPage))
            .pipe(nunjucksRender({ path: [config.srcPath] }))
            .pipe(remember(cacheName))
            .pipe(gulp.dest(dest));

        // build styleguide index
        gulp.src(styleguideIndexGlob)
            .pipe(plumber(function(error) {
                gutil.log(error.message);
                this.emit('end');
            }))
            .pipe(data(getDataForIndex))
            .pipe(nunjucksRender({ path: [config.srcPath] }))
            .pipe(gulp.dest(dest));

        done();
    });

    gulp.add('styleguide:watch', function() {
        var watcher = gulp.watch(srcGlob, ['styleguide:build', 'server:reload']),
            sgWatcher = gulp.watch(config.srcPath + 'styleguide/**/*.html', ['styleguide:build', 'server:reload']);

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
    });

    gulp.add('styleguide:reset', function(done) {
        delete cache.caches[cacheName];
        remember.forgetAll(cacheName);
        done();
    });
};