'use strict';

var config = require('../config'),
    pkg = require('../../package.json'),
    bs = require('bootstrap-sass/package.json'),
    jq = require('jquery/package.json'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    path = require('path'),
    dir = require('node-dir'),
    del = require('del'),
    nunjucksRender = require('gulp-nunjucks-render'),
    data = require('gulp-data'),
    watch = require('gulp-watch'),

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
     * recursively return html files in (sub)dirs
     * @param {string} dirName Directory to walk through.
     * @param {function} cb Callback function.
     */
    function getFiles(dirName, cb) {
        var retArray = [];

        dir.readFiles(dirName, {
            match: /.html$/,
            sync: true
        }, function(err, content, next) {
            if (err) { throw err; }
            next();
        }, function(err, files) {
            if (err) { throw err; }
            files.forEach(function(file, i) {
                var cleanPath = file.replace(config.srcPath, '').substring(1),
                    filePath = path.dirname(cleanPath),
                    type = filePath.split('\\').slice(-1)[0],
                    name = path.basename(file, '.html');

                retArray.push({
                    path: cleanPath,
                    type: type,
                    name: name
                });
            });

            if (typeof cb === 'function') {
                cb(retArray);
            }
        });
    }

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
            meta: { title: config.name + " - " + name },
            paths: dataPaths
        };
    }

    /**
     * Gets data to build styleguide index.
     * @param {function} cb Callback function.
     */
    function getDataForIndex(cb) {

        var elements = [],
            components = [],
            pages = [];

        getFiles(config.srcPath + '/elements', function(res) {
            elements = res;
            getFiles(config.srcPath + '/components', function(res) {
                components = res;
                getFiles(config.srcPath + '/styleguide/pages', function(res) {
                    pages = res;
                    cb({
                        meta: { title: config.name },
                        paths: dataPaths,
                        project: dataProject,
                        elements: elements,
                        components: components,
                        pages: pages
                    });
                });
            });
        });
    }

    /**
     * builds styleguide elements
     */
    gulp.add('styleguide:elements', function(done) {
        del.sync([dest + '/elements']);
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
        del.sync([dest + '/components']);
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
        del.sync([dest + '/pages']);
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
        getDataForIndex(function(indexData) {
            gulp.src(srcSgIndex)
                .pipe(plumber(function(error) {
                    gutil.log(error.message);
                    this.emit('end');
                }))
                .pipe(data(indexData))
                .pipe(nunjucksRender({ path: [config.srcPath] }))
                .pipe(gulp.dest(dest));
            done();
        });
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
        watch(srcSgIndex, {
            read: false
        }, function(file) {
            gutil.log('>>> ' + path.relative(file.base, file.path) + ' (' + file.event + ').');
            gulp.start(['styleguide:index', 'server:reload']);
        });

        // watch styleguide element chages
        watch(srcSgElements, {
            read: false
        }, function(file) {
            gutil.log('>>> ' + path.relative(file.base, file.path) + ' (' + file.event + ').');
            gulp.start(['styleguide:build', 'server:reload']);
        });

        // watch styleguide component changes
        watch(srcSgComponents, {
            read: false
        }, function(file) {
            gutil.log('>>> ' + path.relative(file.base, file.path) + ' (' + file.event + ').');
            gulp.start(['styleguide:build', 'server:reload']);
        });

        // watch styleguide pages changes
        watch(srcSgPages, {
            read: false
        }, function(file) {
            gutil.log('>>> ' + path.relative(file.base, file.path) + ' (' + file.event + ').');
            gulp.start(['styleguide:build', 'server:reload']);
        });
    });
};
