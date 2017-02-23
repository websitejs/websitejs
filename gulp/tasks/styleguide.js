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
    dest = config.destPath + '/styleguide';

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
            paths: dataPaths
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
            .pipe(data(getDataForFile))
            .pipe(nunjucksRender({ path: [config.srcPath] }))
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
            .pipe(data(getDataForFile))
            .pipe(nunjucksRender({ path: [config.srcPath] }))
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
            .pipe(data(getDataForPage))
            .pipe(nunjucksRender({ path: [config.srcPath] }))
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
        gulp.watch(srcSgIndex, ['styleguide:index', 'server:reload']);

        // watch styleguide element chages
        gulp.watch(srcSgElements, ['styleguide:elements', 'styleguide:components', 'server:reload']);

        // watch styleguide component changes
        gulp.watch(srcSgComponents, ['styleguide:components', 'styleguide:pages', 'server:reload']);

        // watch styleguide pages changes
        gulp.watch(srcSgPages, ['styleguide:pages', 'server:reload']);
    });
};
