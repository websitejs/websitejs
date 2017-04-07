'use strict';

var config = require('../../.project/.config'),
    vendorConfig = require('../../' + config.srcPath + '/vendor/.config'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    del = require('del'),
    rename = require('gulp-rename'),
    filter = require('gulp-filter'),
    uglify = require('gulp-uglify'),
    cssnano = require('gulp-cssnano'),
    concat = require('gulp-concat'),
    stripJs = require('gulp-strip-comments'),
    stripCss = require('gulp-strip-css-comments'),
    notify = require('gulp-notify');

module.exports = function() {

    gulp.task('vendor:build', function(done) {

    var destPathJs = config.destVendorJs,
        destPathCss = config.destVendorCss;

        // cleanup
        del.sync([
            config.destVendorJs + '/**/*.js',
            config.destVendorCss + '/**/*.css'
        ], { force: true });

        for (var lib in vendorConfig.vendor) {

            // filters
            var filterScripts = filter(['**/*.js', '**/*.min.js']),
                filterScriptsMin = filter(['**/*.js', '!**/*.min.js'], { restore: true }),
                filterStyles = filter(['**/*.css', '**/*.min.css']),
                filterStylesMin = filter(['**/*.css', '!**/*.min.css'], { restore: true });

            // build
            gulp.src(vendorConfig.vendor[lib])
                .pipe(plumber(function(error) {
                    gutil.log(error.message);
                    notify().write(error.message);
                    this.emit('end');
                }))
                .pipe(filterScripts)
                .pipe(filterScriptsMin)
                .pipe(uglify({ mangle: false }))
                .pipe(filterScriptsMin.restore)
                .pipe(concat(lib + '.js'))
                .pipe(stripJs())
                .pipe(rename({
                    suffix: '.min'
                }))
                .pipe(gulp.dest(destPathJs));

            gulp.src(vendorConfig.vendor[lib])
                .pipe(plumber(function(error) {
                    gutil.log(error.message);
                    notify().write(error.message);
                    this.emit('end');
                }))
                .pipe(filterStyles)
                .pipe(filterStylesMin)
                .pipe(cssnano({ zindex: false }))
                .pipe(filterStylesMin.restore)
                .pipe(concat(lib + '.css'))
                .pipe(stripCss({ preserve: false }))
                .pipe(rename({ suffix: '.min' }))
                .pipe(gulp.dest(destPathCss));
        }
        done();
    });
};
