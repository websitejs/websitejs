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
    dir = require('node-dir'),
    del = require('del'),
    nunjucksRender = require('gulp-nunjucks-render'),
    data = require('gulp-data'),
    watch = require('gulp-watch'),
    notify = require('gulp-notify'),

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
     * @param {string} ext File extension.
     * @param {function} cb Callback function.
     */
    function getFiles(root, dirName, ext, cb) {
        var retArray = [],
            regex = new RegExp(ext + '$', 'i'),
            fullPath = root + dirName;

        if (fs.existsSync(fullPath)) {
            dir.readFiles(fullPath, {
                match: regex,
                sync: true
            }, function(err, content, next) {
                if (err) { gutil.log(err); }
                next();
            }, function(err, files) {
                if (err) { gutil.log(err); }
                files.forEach(function(file, i) {
                    var cleanPath = file.replace(root, '').substring(1),
                        filePath = path.dirname(cleanPath),
                        type = filePath.split('\\').slice(-1)[0],
                        name = path.basename(file, ext).replace('.min', '');

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
        } else {
            if (typeof cb === 'function') {
                cb(retArray);
            }
        }
    }

    /**
     * returns data object with file info for elements/components
     * @param {object} file File to process
     * @param {function} cb Callback function.
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
     * @param {function} cb Callback function.
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
            pages = [],
            stylesheets = [];

        getFiles(config.srcPath, '/elements', '.html', function(res) {
            elements = res;
            getFiles(config.srcPath, '/components', '.html', function(res) {
                components = res;
                getFiles(config.srcPath, '/styleguide/pages', '.html', function(res) {
                    pages = res;
                    getFiles(config.destPath, '/css', '.css', function(res) {
                        stylesheets = res;
                        var ret = {
                            meta: { title: config.name },
                            paths: dataPaths,
                            project: dataProject,
                            elements: elements,
                            components: components,
                            pages: pages,
                            stylesheets: stylesheets
                        };
                        cb(ret);
                    });
                });
            });
        });
    }

    /**
     * builds styleguide elements
     */
    gulp.add('styleguide:elements', function(done) {
        getFiles(config.destPath, '/css', '.css', function(res) {

            del.sync([dest + '/elements']);

            gulp.src(config.srcPath + '/elements/**/*.json')
                .pipe(gulp.dest(dest + '/elements'));

            gulp.src(srcSgElements)
                .pipe(plumber(function(error) {
                    gutil.log(error.message);
                    notify().write(error.message);
                    this.emit('end');
                }))
                .pipe(data(function(file) {
                    var ret = getDataForFile(file);
                    ret.stylesheets = res;
                    return ret;
                }))
                .pipe(nunjucksRender({ path: [config.srcPath] }))
                .pipe(gulp.dest(dest + '/elements'));
            done();
        });
    });

    /**
     * builds styleguide components
     */
    gulp.add('styleguide:components', function(done) {
        getFiles(config.destPath, '/css', '.css', function(res) {

            del.sync([dest + '/components']);

            gulp.src(config.srcPath + '/components/**/*.json')
                .pipe(gulp.dest(dest + '/components'));

            gulp.src(srcSgComponents)
                .pipe(plumber(function(error) {
                    gutil.log(error.message);
                    notify().write(error.message);
                    this.emit('end');
                }))
                .pipe(data(function(file) {
                    var ret = getDataForFile(file);
                    ret.stylesheets = res;
                    return ret;
                }))
                .pipe(nunjucksRender({ path: [config.srcPath] }))
                .pipe(gulp.dest(dest + '/components'));
            done();
        });
    });

    /**
     * builds styleguide pages
     */
    gulp.add('styleguide:pages', function(done) {
        getFiles(config.destPath, '/css', '.css', function(res) {

            del.sync([dest + '/pages']);

            gulp.src(config.srcPath + '/pages/**/*.json')
                .pipe(gulp.dest(dest + '/pages'));

            gulp.src(srcSgPages)
                .pipe(plumber(function(error) {
                    gutil.log(error.message);
                    notify().write(error.message);
                    this.emit('end');
                }))
                .pipe(data(function(file) {
                    var ret = getDataForPage(file);
                    ret.stylesheets = res;
                    return ret;
                }))
                .pipe(nunjucksRender({ path: [config.srcPath] }))
                .pipe(gulp.dest(dest + '/pages'));
            done();
        });
    });

    /**
     * builds styleguide index
     */
    gulp.add('styleguide:index', function(done) {
        getDataForIndex(function(indexData) {
            gulp.src(srcSgIndex)
                .pipe(plumber(function(error) {
                    gutil.log(error.message);
                    notify().write(error.message);
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
        watch(config.srcPath + '/**/*.json', {
            read: false
        }, function(file) {
            gutil.log('>>> ' + path.relative(file.base, file.path) + ' (' + file.event + ').');
            gulp.start(['styleguide:build', 'server:reload']);
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
