/// <binding />
'use strict';

var config = require('./gulp.json'),
    fs = require('fs'),
    gulp = require('gulp'),
    
    plugins = {
        del: require('del'),
        gulpUtil: require('gulp-util'),
        cache: require('gulp-cached'),
        remember: require('gulp-remember'),
        rename: require('gulp-rename'),
        sass: require('gulp-sass'),
        cssGlob: require('gulp-css-globbing'),
        sourcemaps: require('gulp-sourcemaps'),
        autoprefixer: require('gulp-autoprefixer'),
        sassdoc: require('sassdoc'),
        jshint: require('gulp-jshint'),    
        concat: require('gulp-concat'),       
        uglify: require('gulp-uglify'),      
        jsdoc: require('gulp-jsdoc3')       
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
gulp.task('docs', ['sass:docs', 'scripts:docs']);
gulp.task('watch', ['sass:watch', 'scripts:watch']);
gulp.task('all', ['sass:build', 'sass:docs', 'scripts:build', 'scripts:docs']);
gulp.task('default', ['sass:build', 'scripts:build']);
