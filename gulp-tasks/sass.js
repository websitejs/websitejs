'use strict';

var config = require('../config.json'),
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
    sassdoc = require('sassdoc');

module.exports = function() {
    
    // paths
    var srcGlob = config.paths.src + config.paths.scss.src + '/styles.scss',
        dest = config.paths.dest + config.paths.scss.dest,
        docs = config.paths.dest + config.paths.scss.docs;

    gulp.add('sass:build', function(done) {

        // cleanup
        del.sync([dest + '*[.css,.css.map']);

        // build
        gulp.src(srcGlob)
            .pipe(plumber(function(error) {
                gutil.log(error.message);
                this.emit('end');
            }))
            .pipe(sourcemaps.init())
            .pipe(cssGlob({ extensions: ['.scss'] }))
            .pipe(sass({
                outputStyle: 'expanded',
                defaultEncoding: 'utf-8',
                unixNewlines: false,
                errLogToConsole: true,
                stopOnError: false,
                cacheLocation: config.paths.src + '.sass-cache/',
                precision: 4,
                compass: false
            }))
            .pipe(autoprefixer({ browsers: ['> 5%', 'IE 11', 'last 3 version'], cascade: false }))
            .pipe(cssNano({ zindex: false }))
            .pipe(rename({ suffix: '.min' }))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(dest))
            .on('end', done);
    });

    gulp.add('sass:watch', function() {
        gulp.watch(config.paths.src + '/**/*.scss', ['sass:build', 'server:reload']);
    });

    gulp.add('sass:docs', function(done) {
        gulp.src(config.paths.src + '/**/*.scss')
            .pipe(sassdoc({
                package: './package.json',
                dest: docs
            }))
            .resume();
        done();
    });
};