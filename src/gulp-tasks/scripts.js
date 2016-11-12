'use strict';

var config = require('../../gulp.json'),
    gulp = require('gulp');

module.exports = function(plugins) {
    
    // paths
    var fileName = config.paths.scripts.fileName,
        srcGlob = [
            config.paths.src + config.paths.elements.src + '/**/*.js',
            config.paths.src + config.paths.components.src + '/**/*.js',
            config.paths.src + config.paths.scripts.src + '/**/*.js',
            config.paths.src + '/' + fileName
        ],
        dest = config.paths.dest + config.paths.scripts.dest,
        docs = config.paths.dest + config.paths.scripts.docs,
        cacheName = 'scriptFiles';

    gulp.add('scripts:build', function(done) {

        // cleanup
        plugins.del.sync([dest + '*.js']);

        // build
        gulp.src(srcGlob)
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.cache(cacheName)) // only process changed files
            .pipe(plugins.jshint())
            .pipe(plugins.jshint.reporter('jshint-stylish'))
            .pipe(plugins.remember(cacheName)) // add back all files to the stream
            .pipe(plugins.concat(fileName)
            .on('error', plugins.gulpUtil.log))
            .pipe(plugins.uglify({ 
                mangle: false 
            }).on('error', plugins.gulpUtil.log))
            .pipe(plugins.rename({ 
                suffix: '.min' 
            }))
            .pipe(plugins.sourcemaps.write('.'))
            .pipe(gulp.dest(dest));

        done();
    });

    gulp.add('scripts:watch', function() {
        var watcher = gulp.watch(srcGlob, ['scripts:build']);
        watcher.on('change', function(e) {
            if (e.type === 'deleted') {
                delete plugins.cache.caches[cacheName][e.path];
                plugins.remember.forget(cacheName, e.path);
            }
        });
    });

    gulp.add('scripts:docs', function(done) {

        var cfg = {
            "tags": {
                "allowUnknownTags": true
            },
            "opts": {
                "destination": docs
            },
            "plugins": [
                "plugins/markdown"
            ],
            "templates": {
                "cleverLinks": false,
                "monospaceLinks": false,
                "default": {
                "outputSourceFiles": true
                },
                "path": "ink-docstrap",
                "theme": "cerulean",
                "navType": "vertical",
                "linenums": true,
                "dateFormat": "MMMM Do YYYY, h:mm:ss a"
            }
        };

        // add readme
        srcGlob.unshift('./README.md');

        gulp.src(srcGlob, {
            read: false
        })
        .pipe(plugins.jsdoc(cfg, done));
    });

    gulp.add('scripts:reset', function(done) {
        delete plugins.cache.caches[cacheName];
        plugins.remember.forgetAll(cacheName);
        done();
    });
};