/// <reference path="../typings/index.d.ts" />

'use strict';

var config = require('../config.json'),
    gulp = require('gulp'),
    del = require('del'),
    path = require('path'),
    cache = require('gulp-cached'),
    remember = require('gulp-remember');

module.exports = function() {
    
    // paths
    var srcGlob = [],
        dest = '',
        cacheName = 'libFiles';

    gulp.add('libs:build', function(done) {

        for (var lib in config.paths.libraries) {
            config.paths.libraries[lib].forEach(function(path, i) {
                srcGlob.push(path);
            });
        }
        
        // cleanup
        del.sync([
            config.paths.dest + config.paths.scripts.dest + '/vendor/**/*.js',
            config.paths.dest + config.paths.scss.dest + '/vendor/**/*.css'
        ]);

        // build
        gulp.src(srcGlob)
            .pipe(cache(cacheName)) // only process changed files
            .pipe(remember(cacheName)) // add back all files to the stream
            .pipe(gulp.dest(function(file) {
                switch(path.extname(file.relative)) {
                    case '.js':
                        dest = config.paths.dest + config.paths.scripts.dest + '/vendor';
                        break;
                    case '.css':
                        dest = config.paths.dest + config.paths.styles.dest + '/vendor';
                        break;
                    default:
                        dest = config.paths.dest;
                        break;
                }
                return dest;
            }));

        done();
    });

    gulp.add('libs:reset', function(done) {
        delete cache.caches[cacheName];
        remember.forgetAll(cacheName);
        done();
    });
};