'use strict';

var config = require('./gulp/config'),
    fs = require('fs'),
    gulp = require('gulp');


/**
 * gets all tasks
 * @private
 */
var getAllTasks = function() {
    var path = config.gulpTaskPath;
    var files = fs.readdirSync(path);
    files.forEach(function(file, i) {
        require(path + '/' + file)();
    });
};

/**
 * get external defined tasks
 * @param {string} task Taskname
 * @param {string} [path] Optional path
 * @private
 */
var getTask = function(task, path) {
    if (typeof path === 'undefined') {
        path = config.gulpTaskPath;
    }
    require(path + '/' + task)();
};

// load tasks
getAllTasks();

gulp.add('config:watch', function() {
    gulp.watch(['gulp/config.json', 'package.json', 'gulpfile.js'], ['default', 'server:reload']);
});

// main tasks
gulp.task('docs', ['styles:docs', 'scripts:docs']);
gulp.task('vendor', ['vendor:build']);
gulp.task('assets', ['assets:svg:icons', 'assets:images']);
gulp.task('styles', ['styles:build']);
gulp.task('scripts', ['scripts:reset', 'scripts:build']);
gulp.task('styleguide', ['styleguide:reset', 'styleguide:build']);

gulp.task('watch', ['config:watch', 'styles:watch', 'scripts:watch', 'styleguide:watch', 'assets:images:watch']);
gulp.task('serve', ['server:start' , 'watch']);
gulp.task('server', ['server:start']);
gulp.task('all', ['vendor', 'styles', 'scripts', 'styleguide', 'assets', 'docs']);
gulp.task('prod', ['vendor', 'styles', 'scripts', 'assets']);
gulp.task('default', ['vendor', 'styles', 'scripts', 'styleguide', 'assets']);

gulp.task('test', ['test:galen']);
