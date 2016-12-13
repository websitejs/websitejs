'use strict';

var config = require('../config.json'),
    gulp = require('gulp'),
    browserSync = require('browser-sync').create();

module.exports = function() {

    var destPath = config.paths.dest;

    gulp.task('server:start', function(done) {

        browserSync.init({
            server: {
                baseDir: destPath
            },
            ui: false,
            open: false,
            notify: false,
            reloadDelay: 1000
        });

        browserSync.emitter.on('init', function () {
            done();
        });
    });

    gulp.task('server:reload', function(done) {
        browserSync.reload();
        browserSync.emitter.on('browser:reload', function() {
            console.log('Server reloaded on ' + new Date().toLocaleString('nl-NL', 'Europe/Amsterdam'));
        });
        done();
    });

    gulp.task('server:stop', function(done) {
        browserSync.exit();
        browserSync.emitter.on('service:exit', function () {
            console.log('Server stopped.');
            done();
        });
    });
};