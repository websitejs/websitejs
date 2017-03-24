'use strict';

var config = require('../../.project/.config'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    path = require('path'),
    del = require('del'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    cssGlob = require('gulp-css-globbing'),
    cssNano = require('gulp-cssnano'),
    //strip = require('gulp-strip-css-comments'),
    sassdoc = require('sassdoc'),
    watch = require('gulp-watch'),
    notify = require('gulp-notify');

module.exports = function() {

    // paths
    var srcGlob = [
            config.srcPath + '/styles.scss',
            config.srcCssPath + '/**/*.scss'
        ],
        dest = config.destCssPath,
        docs = config.destDocsPathCss;

    gulp.add('styles:build', function(done) {

        // cleanup
        del.sync([dest + '*[.css,.css.map', dest + '/themes/*[.css,.css.map'], { force: true });

        // build
        gulp.src(srcGlob)
            .pipe(plumber(function(error) {
                gutil.log(error.message);
                notify().write(error.message);
                this.emit('end');
            }))
            .pipe(sourcemaps.init())
            .pipe(cssGlob({ extensions: ['.scss'], ignoreFolders: ['.', './scss'] }))
            .pipe(sass({
                outputStyle: 'expanded',
                defaultEncoding: 'utf-8',
                unixNewlines: false,
                cacheLocation: config.srcPath + '.sass-cache/',
                precision: 4,
                compass: false,
                includePaths: ['node_modules'],
                errLogToConsole: true,
                stopOnError: false
            }).on('error', function(err) {
                notify({ title: 'SASS compile issue' }).write('line ' + err.line + ', col ' + err.column + ': ' + err.messageOriginal);
                //notify(err.messageOriginal);
                this.emit('end');
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
        watch(config.srcPath + '/**/*.scss', {
            read: false
        }, function(file) {
            gutil.log('>>> ' + path.relative(file.base, file.path) + ' (' + file.event + ').');
            gulp.start(['styles:build', 'server:reload']);
        });
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
