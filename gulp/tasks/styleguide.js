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
    data = require('gulp-data'),

    dataPaths = {
        css: config.tplCssPath,
        js: config.tplJsPath,
        jsFilename: config.jsFilename
    },
    dataProject = {
        name: config.name,
        version: pkg.version,
        bsversion: bs.version,
        jqversion: jq.version
    },

    srcSgElements = [config.srcPath + '/elements/**/*.html'],
    srcSgComponents = [config.srcPath + '/components/**/*.html'],
    srcSgPages = [config.srcPath + '/styleguide/pages/**/*.html'],
    srcSgIndex = [config.srcPath + '/styleguide/index.html'],
    dest = config.destPath + '/styleguide',
    cacheNameElements = 'sgElements',
    cacheNameComponents = 'sgComponents',
    cacheNamePages = 'sgPages';

module.exports = function() {

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
            meta: { title: config.name + " - " + type + " - " + name },
            paths: dataPaths,
            name: name,
            type: type,
            extends: true
        };
    };

    /**
     * returns data object with info for pages
     * @param {object} file File to process
     * @returns {object} File data object
     * @private
     */
    function getDataForPage(file) {
        var name = path.basename(file.relative, '.html');
        return {
            meta: { title: config.name + " - " + name },
            paths: dataPaths,
            extends: false
        };
    };

    /**
     * builds styleguide elements
     */
    gulp.add('styleguide:elements', function(done) {
        gulp.src(srcSgElements)
            .pipe(plumber(function(error) {
                gutil.log(error.message);
                this.emit('end');
            }))
            .pipe(cache(cacheNameElements))
            .pipe(data(getDataForFile))
            .pipe(nunjucksRender({ path: [config.srcPath] }))
            .pipe(remember(cacheNameElements))
            .pipe(gulp.dest(dest + '/elements'));
        done();
    });

    /**
     * builds styleguide components
     */
    gulp.add('styleguide:components', function(done) {
        gulp.src(srcSgComponents)
            .pipe(plumber(function(error) {
                gutil.log(error.message);
                this.emit('end');
            }))
            .pipe(cache(cacheNameComponents))
            .pipe(data(getDataForFile))
            .pipe(nunjucksRender({ path: [config.srcPath] }))
            .pipe(remember(cacheNameComponents))
            .pipe(gulp.dest(dest + '/components'));
        done();
    });

    /**
     * builds styleguide pages
     */
    gulp.add('styleguide:pages', function(done) {
        gulp.src(srcSgPages)
            .pipe(plumber(function(error) {
                gutil.log(error.message);
                this.emit('end');
            }))
            .pipe(cache(cacheNamePages))
            .pipe(data(getDataForFile))
            .pipe(nunjucksRender({ path: [config.srcPath] }))
            .pipe(remember(cacheNamePages))
            .pipe(gulp.dest(dest + '/pages'));
        done();
    });

    /**
     * builds styleguide index
     */
    gulp.add('styleguide:index', function(done) {
        gulp.src(srcSgIndex)
            .pipe(plumber(function(error) {
                gutil.log(error.message);
                this.emit('end');
            }))
            .pipe(data({
                meta: { title: config.name },
                paths: dataPaths,
                project: dataProject,
                components: fs.readdirSync(config.srcPath + '/components'),
                elements: fs.readdirSync(config.srcPath + '/elements'),
                pages: fs.readdirSync(config.srcPath + '/styleguide/pages')
            }))
            .pipe(nunjucksRender({ path: [config.srcPath] }))
            .pipe(gulp.dest(dest));
        done();
    });

    /**
     * builds all styleguide subtasks
     */
    gulp.add('styleguide:build', [
        'styleguide:clean',
        'styleguide:elements',
        'styleguide:components',
        'styleguide:pages',
        'styleguide:index'
    ]);

    /**
     * cleanup styleguide build
     */
    gulp.add('styleguide:clean', function(done) {
        // cleanup
        del.sync([dest]);
        done();
    });

    /**
     * watch all styleguide changes
     */
    gulp.add('styleguide:watch', function(done) {
        // watch styleguide index changes
        var wSgIndex = gulp.watch(srcSgIndex, ['styleguide:index', 'server:reload']);

        // watch styleguide element chages
        var wSgElements = gulp.watch(srcSgElements, ['styleguide:elements', 'server:reload']);
        wSgElements.on('change', function(e) {
            if (e.type === 'deleted') {
                delete cache.caches[cacheNameElements][e.path];
                remember.forget(cacheNameElements, e.path);
            }
        });

        // watch styleguide component changes
        var wSgComponents = gulp.watch(srcSgComponents, ['styleguide:components', 'server:reload']);
        wSgComponents.on('change', function(e) {
            if (e.type === 'deleted') {
                delete cache.caches[cacheNameComponents][e.path];
                remember.forget(cacheNameComponents, e.path);
            }
        });

        // watch styleguide pages changes
        var wSgPages = gulp.watch(srcSgPages, ['styleguide:pages', 'server:reload']);
        wSgPages.on('change', function(e) {
            if (e.type === 'deleted') {
                delete cache.caches[cacheNamePages][e.path];
                remember.forget(cacheNamePages, e.path);
            }
        });
    });

    /**
     * reset styleguide cache
     */
    gulp.add('styleguide:reset', function(done) {
        delete cache.caches[cacheNameElements];
        delete cache.caches[cacheNameComponents];
        delete cache.caches[cacheNamePages];
        remember.forgetAll(cacheNameElements);
        remember.forgetAll(cacheNameComponents);
        remember.forgetAll(cacheNamePages);
        done();
    });
};
