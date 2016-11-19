/// <reference path="../typings/index.d.ts" />

'use strict';

var config = require('../config.json'),
    gulp = require('gulp'),
    browserSync = require('browser-sync').create();

module.exports = function() {
    
    // paths
    gulp.add('server:start', function(done) {

        // start browsersync server
        browserSync.init({
            server: {
                baseDir: config.paths.dest
            },
            open: false,
            reloadDelay: 1000
        });

    });

    gulp.add('server:reload', function(done) {
        browserSync.reload();
        done();
    });
};