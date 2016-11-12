'use strict';

var config = require('../../gulp.json'),
    gulp = require('gulp');

module.exports = function(plugins) {
    
    gulp.add('sass', function(done) {

        // paths
        var src = config.paths.src + config.paths.scss.src,
            dest = config.paths.dest + config.paths.scss.dest,
            docs = config.paths.dest + config.paths.scss.docs;

        // cleanup
        plugins.del.sync([dest + '*.css']);

        // build
        gulp.src(src + '/**/*.scss')
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.rename({ suffix: '.min' }))
            .pipe(plugins.sassGlob())
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
            .pipe(plugins.sourcemaps.write('.'))
            .pipe(gulp.dest(dest))
            .pipe(plugins.sassdoc({
                package: './package.json',
                dest: docs
            }))
            .resume();
        
        done();
    });
};