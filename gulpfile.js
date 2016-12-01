/// <binding />
/// <reference path="typings/index.d.ts" />

'use strict';

var config = require('./config.json'),
    fs = require('fs'),
    gulp = require('gulp');

/**
 * gets all tasks
 * @private
 */
var getAllTasks = function() {
    var path = config.paths.tasks;
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
        path = config.paths.src + config.paths.tasks;
    }
    require(path + '/' + task)();
};

// load tasks
getAllTasks();

gulp.add('config:watch', function() {
    gulp.watch(['config.json', 'package.json', 'gulpfile.js'], ['default', 'server:reload']);
});

// main tasks
gulp.task('docs', ['sass:docs', 'scripts:docs']);
gulp.task('libs', ['libs:build']);
gulp.task('assets', ['assets:images:reset', 'assets:images']);
gulp.task('sass', ['sass:build']);
gulp.task('scripts', ['scripts:reset', 'scripts:build']);
gulp.task('styleguide', ['styleguide:reset', 'styleguide:build']);

gulp.task('watch', ['config:watch', 'sass:watch', 'scripts:watch', 'styleguide:watch', 'assets:images:watch']);
gulp.task('serve', ['server:start' , 'watch']);
gulp.task('all', ['libs', 'sass', 'scripts', 'styleguide', 'assets', 'docs']);
gulp.task('prod', ['libs', 'sass', 'scripts', 'assets']);
gulp.task('default', ['libs', 'sass', 'scripts', 'styleguide', 'assets']);

gulp.task('test', ['server:start', 'test:galen']);
