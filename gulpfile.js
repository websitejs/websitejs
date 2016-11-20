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

// main tasks
gulp.task('docs', ['sass:docs', 'scripts:docs']);
gulp.task('watch', ['sass:watch', 'scripts:watch', 'styleguide:watch']);
gulp.task('serve', ['server:start' , 'watch']);
gulp.task('all', ['sass:build', 'sass:docs', 'scripts:build', 'scripts:docs', 'styleguide:build']);
gulp.task('prod', ['sass:build', 'scripts:build']);
gulp.task('default', ['sass:build', 'scripts:build', 'styleguide:build']);
