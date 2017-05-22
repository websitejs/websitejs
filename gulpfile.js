'use strict';

var config = require('./.project/.config'),
    fs = require('fs'),
    path = require('path'),
    gulp = require('gulp');


/**
 * gets all tasks
 * @private
 */
var getAllTasks = function() {
    var taskPath = config.gulpTaskPath;
    var files = fs.readdirSync(taskPath);
    files.forEach(function(file, i) {
        require('./' + path.join(taskPath, file))();
    });
};

// load tasks
getAllTasks();

gulp.add('config:watch', function() {
    gulp.watch(['./gulp/config.js', './package.json', './gulpfile.js'], ['default', 'server:reload']);
});

// main tasks
gulp.task('docs', ['styles:docs', 'scripts:docs']);
gulp.task('vendor', ['vendor:build']);
gulp.task('fonts', ['assets:fonts']);
gulp.task('assets', ['assets:svg:icons', 'assets:images', 'assets:fonts']);
gulp.task('styles', ['styles:build', 'sasslint']);
gulp.task('scripts', ['scripts:reset', 'scripts:build']);
gulp.task('styleguide', ['styleguide:build']);

gulp.task('watch', ['config:watch', 'styles:watch', 'scripts:watch', 'styleguide:watch', 'assets:images:watch', 'assets:svg:icons:watch']);
gulp.task('serve', ['default', 'server:start' , 'watch']);
gulp.task('server', ['default', 'server:start']);
gulp.task('all', ['vendor', 'styles', 'scripts', 'styleguide', 'assets', 'docs']);
gulp.task('prod', ['vendor', 'styles', 'scripts', 'assets']);
gulp.task('default', ['vendor', 'styles', 'scripts', 'styleguide', 'assets']);

gulp.task('test', ['test:galen']);
