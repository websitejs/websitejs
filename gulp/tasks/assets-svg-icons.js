'use strict';

var config = require('../config'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    path = require('path'),
    del = require('del'),
    rename = require('gulp-rename'),
    svgmin = require('gulp-svgmin'),
    svgstore = require('gulp-svgstore'),
    watch = require('gulp-watch');

// paths
var srcGlob = [
        config.srcPath + '/assets/icons/svg-icons/**/*.svg'
    ],
    dest = config.destPath + '/assets/icons';

module.exports = function() {

    gulp.add('assets:svg:icons', function(done) {

        // cleanup first
        del.sync([dest + '**/*[.svg]']);

        gulp.src(srcGlob, {
                base: config.srcPath + '/assets/icons/svg-icons'
            })
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
