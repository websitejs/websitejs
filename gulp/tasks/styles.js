'use strict';

var config = require('../config'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    del = require('del'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    cssGlob = require('gulp-css-globbing'),
    cssNano = require('gulp-cssnano'),
    strip = require('gulp-strip-css-comments'),
    sassdoc = require('sassdoc');

module.exports = function() {

    // paths
    var srcGlob = config.srcPath + '/styles.scss',
        dest = config.destPath + '/css',
        docs = config.destPath + '/docs/styles';

    gulp.add('styles:build', function(done) {

        // cleanup
        del.sync([dest + '*[.css,.css.map']);

        // build
        gulp.src(srcGlob)
            .pipe(plumber(function(error) {
                gutil.log(error.message);
                this.emit('end');
            }))
            .pipe(sourcemaps.init())
            .pipe(cssGlob({ extensions: ['.scss'], ignoreFolders: ['.', './scss'] }))
            .pipe(sass({
                outputStyle: 'expanded',
                defaultEncoding: 'utf-8',
                unixNewlines: false,
                errLogToConsole: true,
                stopOnError: false,
                cacheLocation: config.srcPath + '.sass-cache/',
                precision: 4,
                compass: false
            }))
            .pipe(autoprefixer({ browsers: ['> 5%', 'IE 11', 'last 3 version'], cascade: false }))
            .pipe(cssNano({ zindex: false }))
            //.pipe(strip({ preserve: false }))
            .pipe(rename({ suffix: '.min' }))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(dest));

        done();
    });

    gulp.add('styles:watch', function() {
        gulp.watch(config.srcPath + '/**/*.scss', ['styles:build', 'server:reload']);
    });

    gulp.add('styles:docs', function(done) {
        gulp.src(config.srcPath + '/**/*.scss')
            .pipe(sassdoc({
                package: './package.json',
                dest: docs
            }))
            .resume();
        done();
    });
};
