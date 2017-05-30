'use strict';

var gulp = require('gulp'),
    taskListing = require('gulp-task-listing');

module.exports = function() {

    var exclude = [
        'server', // exclude main- and sub tasks
        'test:' // exclude sub tasks
    ];

    gulp.task('help', taskListing.withFilters(null, function(task) {
        for (let i = 0; i < exclude.length; i++) {
            if (task.indexOf(exclude[i]) !== -1) {
                return true;
            }
        }
    }));

};
