'use strict';

var config = require('../../.project/.config'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    path = require('path'),
    del = require('del'),
    rename = require('gulp-rename'),
    svgmin = require('gulp-svgmin'),
    svgstore = require('gulp-svgstore'),
    watch = require('gulp-watch'),
    notify = require('gulp-notify');

// paths
var srcGlob = [
        config.srcSvgIconPath + '/**/*.svg'
    ],
    dest = config.destSvgIconPath;

module.exports = function() {

    gulp.add('assets:svg:icons', function(done) {

        // cleanup first
        del.sync([dest + '**/*[.svg]'], { force: true });

        gulp.src(srcGlob, {
                base: config.srcSvgIconPath
            })
            .pipe(plumber(function(error) {
                gutil.log(error.message);
                notify().write(error.message);
                this.emit('end');
            }))
            .pipe(svgmin({
                plugins: [{
                    removeDoctype: false
                }, {
                    removeComments: true
                }]
            }))
            .pipe(rename(function(file) {
                var name = file.dirname.split(path.sep);
                name.push(file.basename);
                file.basename = name.join('-');
            }))
            .pipe(svgstore())
            .pipe(gulp.dest(dest));
         done();
    });

    gulp.add('assets:svg:icons:watch', function() {
        watch(srcGlob, {
            read: false
        }, function(file) {
            gutil.log('>>> ' + path.relative(file.base, file.path) + ' (' + file.event + ').');
            gulp.start(['assets:svg:icons', 'server:reload']);
        });
    });
};
