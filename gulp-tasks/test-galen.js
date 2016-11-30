'use strict';

var config = require('../config.json'),
    gulp = require('gulp'),
    gulpGalen = require('gulp-galenframework');

module.exports = function() {

    var galenProperties = {
        'galen.browserFactory.selenium.runInGrid': true,
        'galen.browserFactory.selenium.grid.url': 'http://localhost.efocus.local:3000/styleguide'
    };
    
    // paths
    gulp.add('test:galen', function(done) {

    gulp.src(config.paths.components + '/**/*.gspec')
        .pipe(gulpGalen.test({
            'htmlreport': config.paths.dest + '/test/layout',
            'properties': galenProperties,
            'cwd': config.paths.src + 'test/galen/'
        }, done));

    });

};