'use strict';

var config = require('../config.json'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    changed = require('gulp-changed'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant');

    // paths
    var srcGlob = [
            config.paths.src + config.paths.assets.images.src + '/**/*.*'
        ],
        dest = config.paths.dest + config.paths.assets.images.dest;

module.exports = function() {
    
    gulp.add('assets:images', function(done) {

        gulp.src(srcGlob)
            .pipe(plumber(function(error) {
                gutil.log(error.message);
                this.emit('end');
            }))
            .pipe(changed(dest))
            .pipe(imagemin({
                progressive: true,
                svgoPlugins: [{ removeViewBox: false }],
                use: [pngquant()]
            }))
            .pipe(gulp.dest(dest))
            .on('end', done);
    }); 

    gulp.add('assets:images:watch', function() {
        var watcher = gulp.watch(srcGlob, ['assets:images', 'server:reload']);
    }); 
};