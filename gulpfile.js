/// <binding />
'use strict';

var config = require('./gulp.json'),
    fs = require('fs'),
    gulp = require('gulp'),
    
    plugins = {
        del: require('del'),
        rename: require('gulp-rename'),
        sass: require('gulp-sass'),
        sassGlob: require('gulp-sass-glob'),
        sourcemaps: require('gulp-sourcemaps'),
        autoprefixer: require('gulp-autoprefixer'),
        sassdoc: require('sassdoc'),
        jshint: require('gulp-jshint')       
    };

/**
 * gets all tasks
 * @private
 */
var getAllTasks = function() {
    var path = config.paths.src + config.paths.tasks;
    var files = fs.readdirSync(path);
    files.forEach(function(file, i) {
        require(path + '/' + file)(plugins);
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
    require(path + '/' + task)(plugins);
};

// load tasks
getAllTasks();

// main tasks
gulp.task('default', ['sass']);
