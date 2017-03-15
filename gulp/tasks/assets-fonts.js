'use strict';

var config = require('../config'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    changed = require('gulp-changed'),
    notify = require('gulp-notify'),

    srcFonts = [ config.srcPath + '/assets/fonts/**/*.{woff,woff2}' ],
    dest = config.destPath + '/assets/fonts';

module.exports = function() {
    gulp.add('assets:fonts', function(done) {
        gulp.src(srcFonts)
            .pipe(plumber(function(error) {
                gutil.log(error.message);
                notify().write(error.message);
                this.emit('end');
            }))
            .pipe(changed(dest))
            .pipe(gulp.dest(dest));
        done();
    });
};
