'use strict';

var config = require('../../gulp.json'),
    gulp = require('gulp');

module.exports = function(plugins) {
    
    // paths
    var srcGlob = config.paths.src + config.paths.scss.src + '/styles.scss',
        dest = config.paths.dest + config.paths.scss.dest,
        docs = config.paths.dest + config.paths.scss.docs,
        cacheName = 'sassFiles';

    gulp.add('sass:build', function(done) {

        // cleanup
        plugins.del.sync([dest + '*.css']);

        // build
        gulp.src(srcGlob)
            .pipe(plugins.cache(cacheName)) // only process changed files
            .pipe(plugins.sourcemaps.init())
            //.pipe(plugins.sassGlob())
            .pipe(plugins.cssGlob({
                extensions: ['.scss']
            }))
            .pipe(plugins.sass({
                outputStyle: 'compressed',
                defaultEncoding: 'utf-8',
                unixNewlines: false,
                errLogToConsole: true,
                stopOnError: false,
                cacheLocation: config.paths.src + '.sass-cache/',
                precision: 4
            }).on('error', plugins.sass.logError))
            .pipe(plugins.autoprefixer({
                browsers: ['> 5%', 'IE 11', 'last 3 version'], 
                cascade: false
            }))
            .pipe(plugins.remember(cacheName)) // add back all files to the stream
            .pipe(plugins.rename({ 
                suffix: '.min' 
            }))
            .pipe(plugins.sourcemaps.write('.'))
            .pipe(gulp.dest(dest));

        done();
    });

    gulp.add('sass:watch', function() {
        var watcher = gulp.watch(srcGlob, ['sass:build']);
        watcher.on('change', function(e) {
            if (e.type === 'deleted') {
                delete plugins.cache.caches[cacheName][e.path];
                plugins.remember.forget(cacheName, e.path);
            }
        });
    });

    gulp.add('sass:docs', function(done) {
        gulp.src(srcGlob)
            .pipe(plugins.sassdoc({
                package: './package.json',
                dest: docs
            }))
            .resume();
        done();
    });

    gulp.add('sass:reset', function(done) {
        delete plugins.cache.caches[cacheName];
        plugins.remember.forgetAll(cacheName);
        done();
    });
};