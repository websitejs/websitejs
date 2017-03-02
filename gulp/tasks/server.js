'use strict';

var config = require('../config'),
    gulp = require('gulp'),
    browserSync = require('browser-sync').create();

module.exports = function() {

    gulp.task('server:start', function(done) {

        browserSync.emitter.on('init', function () {
            console.log('Server started.');
        });

        browserSync.emitter.on('browser:reload', function() {
            console.log('Server reloaded on ' + new Date().toLocaleString('nl-NL', 'Europe/Amsterdam'));
        });

        browserSync.emitter.on('service:exit', function() {
            console.log('Server stopped.');
        });

        browserSync.init({
            server: {
                baseDir: config.destPath
            },
            ui: false,
            open: false,
            notify: false,
            reloadDelay: 1000
        });
        done();
    });

    gulp.task('server:reload', function(done) {
        browserSync.reload();
        done();
    });

    gulp.task('server:stop', function(done) {
        browserSync.exit();
        done();
    });
};
