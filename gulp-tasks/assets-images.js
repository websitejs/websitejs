'use strict';

var config = require('../config.json'),
    gulp = require('gulp'),
    gulpUtil = require('gulp-util'),
    del = require('del'),
    cache = require('gulp-cached'),
    remember = require('gulp-remember'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant');

    // paths
    var srcGlob = [
            config.paths.src + config.paths.assets.images.src + '/**/*.*'
        ],
        dest = config.paths.dest + config.paths.assets.images.dest,
        cacheName = 'assetsImages';

module.exports = function() {
    
    gulp.add('assets:images', function(done) {

        // cleanup first
        del.sync([dest]);

        gulp.src(srcGlob)
            .pipe(cache(cacheName))
            .pipe(imagemin({
                progressive: true,
                svgoPlugins: [{ removeViewBox: false }],
                use: [pngquant()]
            })
            .on('error', gulpUtil.log))
            .pipe(remember(cacheName))
            .pipe(gulp.dest(dest));

        done();
    }); 

    gulp.add('assets:images:watch', function() {

        var watcher = gulp.watch(srcGlob, ['assets:images', 'server:reload']);
        watcher.on('change', function(e) {
            if (e.type === 'deleted') {
                delete cache.caches[cacheName][e.path];
                remember.forget(cacheName, e.path);
            }
        });
    });

    gulp.add('assets:images:reset', function(done) {
        delete cache.caches[cacheName];
        remember.forgetAll(cacheName);
        done();
    });  
};