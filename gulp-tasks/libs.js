'use strict';

var config = require('../config.json'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    del = require('del'),
    rename = require('gulp-rename'),
    filter = require('gulp-filter'),
    uglify = require('gulp-uglify'),
    cssnano = require('gulp-cssnano'),
    concat = require('gulp-concat'),
    strip = require('gulp-strip-comments');

module.exports = function() {
    
    gulp.add('libs:build', function(done) {

        // cleanup
        del.sync([
            config.paths.dest + config.paths.scripts.dest + '/vendor/**/*.js',
            config.paths.dest + config.paths.scss.dest + '/vendor/**/*.css'
        ]);

        for (var lib in config.paths.libraries) {

            // filters
            var filterScripts = filter(['**/*.js', '**/*.min.js']),
                filterScriptsMin = filter(['**/*.js', '!**/*.min.js'], { restore: true }),
                filterStyles = filter(['*.css', '*.min.css']),
                filterStylesMin = filter(['*.css', '!*.min.css'], { restore: true });

            // build
            gulp.src(config.paths.libraries[lib])
                .pipe(plumber(function(error) {
                    gutil.log(error.message);
                    this.emit('end');
                }))
                .pipe(filterScripts)
                .pipe(filterScriptsMin)
                .pipe(uglify({ mangle: false }))
                .pipe(filterScriptsMin.restore)
                .pipe(concat(lib + '.js'))
                .pipe(strip())
                .pipe(rename({ suffix: '.min' }))
                .pipe(gulp.dest(config.paths.dest + config.paths.scripts.dest + '/vendor'));

            gulp.src(config.paths.libraries[lib])
                .pipe(plumber(function(error) {
                    gutil.log(error.message);
                    this.emit('end');
                }))  
                .pipe(filterStyles)
                .pipe(filterStylesMin)
                .pipe(cssnano({ zindex: false }))
                .pipe(filterStylesMin.restore)
                .pipe(concat(lib + '.css'))
                .pipe(rename({ suffix: '.min' }))
                .pipe(gulp.dest(config.paths.dest + config.paths.scss.dest + '/vendor'));
        }
        done();
    });
};