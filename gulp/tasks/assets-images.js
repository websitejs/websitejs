'use strict';

var config = require('../config'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    path = require('path'),
    del = require('del'),
    changed = require('gulp-changed'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    watch = require('gulp-watch'),
    notify = require('gulp-notify');

// paths
var srcGlob = [
        config.srcPath + '/assets/img/**/*.*'
    ],
    dest = config.destPath + '/assets/img';

module.exports = function() {

    gulp.add('assets:images', function(done) {

        gulp.src(srcGlob)
            .pipe(plumber(function(error) {
                gutil.log(error.message);
                notify().write(error.message);
                this.emit('end');
            }))
            .pipe(changed(dest))
            .pipe(imagemin({
                progressive: true,
                svgoPlugins: [{ removeViewBox: false }],
                use: [pngquant()]
            }))
            .pipe(gulp.dest(dest));
        done();
    });

    gulp.add('assets:images:watch', function() {
        watch(srcGlob, {
            read: false
        }, function(file) {
            gutil.log('>>> ' + path.relative(file.base, file.path) + ' (' + file.event + ').');

            if (file.event === 'unlink') {
                del.sync([path.join(dest, path.relative(file.base, file.path))]);
            } else {
                gulp.start(['assets:images', 'server:reload']);
            }
        });
    });
};
