'use strict';

var config = require('../config'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    path = require('path'),
    del = require('del'),
    rename = require('gulp-rename'),
    cache = require('gulp-cached'),
    remember = require('gulp-remember'),
    svgmin = require('gulp-svgmin'),
    svgstore = require('gulp-svgstore');

// paths
var srcGlob = [
        config.srcPath + '/assets/icons/**/*.svg'
    ],
    dest = config.destPath + '/assets/icons';

module.exports = function() {

    gulp.add('assets:svg:icons', function(done) {

        // cleanup first
        del.sync([dest + '**/*[.svg]']);
        
        gulp.src(srcGlob, { 
                base: config.srcPath + '/assets/icons'
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
            .pipe(gulp.dest(dest))
            .on('end', done);
    });

    gulp.add('assets:svg:icons:watch', function() {
        var watcher = gulp.watch(srcGlob, ['assets:svg:icons', 'server:reload']);
    }); 
};