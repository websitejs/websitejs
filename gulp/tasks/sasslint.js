'use strict';

var config = require('../../.project/.config'),
    gulp = require('gulp'),
    sasslint = require('gulp-sass-lint'),
    cached = require('gulp-cached');

module.exports = function() {

    // paths
    var srcGlob = [
            config.srcPath + '/styles.scss',
            config.srcPath + '/scss/**/*.scss'
        ];

    gulp.task('sasslint', function () {
    return gulp.src(srcGlob)

        .pipe(cached('sasslint'))
        .pipe(sasslint({
            configFile: './.sass-lint.yml'
        }))
        .pipe(sasslint.format())
        .pipe(sasslint.failOnError())
    });

};
