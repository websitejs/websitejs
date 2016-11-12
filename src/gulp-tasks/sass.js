'use strict';

var config = require('../../gulp.json'),
    gulp = require('gulp');

module.exports = function(plugins) {
    
    gulp.add('sass', function(done) {

        var src = config.paths.src + config.paths.scss.src,
            dest = config.paths.dest + config.paths.scss.dest,
            docs = config.paths.dest + config.paths.scss.docs;

        // cleanup
        plugins.del.sync([dest + '*.css']);

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



        // // cleanup first
        // plugins.del.sync([config.paths.css.dest + '*.css']);

        // var sassFiles = gulp.src(config.paths.css.src + '/*.scss')
        //     //.pipe(plugins.sourcemaps.init())
        //     .pipe(plugins.sass({
        //         outputStyle: 'expanded',
        //         defaultEncoding: 'utf-8',
        //         unixNewlines: false,
        //         stopOnError: true,
        //         cacheLocation: config.srcRoot + '.sass-cache/',
        //         precision: 4,
        //         sourceMap: true,
        //         sourceMapEmbed: true,
        //         outFile: '.'
        //     })
        //     .on('error', plugins.sass.logError))
        //     .pipe(plugins.autoprefixer('last 3 version'))
        //     .pipe(gulp.dest(config.paths.css.dest));
        
        // return plugins.es.pipe(sassFiles)
        //     .pipe(plugins.sourcemaps.init({ loadMaps: true, includeContent: false, sourceRoot: config.paths.css.src }))
        //     .pipe(plugins.rename({ suffix: '.min' }))
        //     .pipe(plugins.cssnano({ zindex: false }))
        //     .pipe(plugins.sourcemaps.write('.'))
        //     .pipe(gulp.dest(config.paths.css.dest))
        //     .pipe(plugins.connect.reload());
    });
};