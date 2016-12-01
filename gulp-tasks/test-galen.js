'use strict';

var config = require('../config.json'),
    gulp = require('gulp'),
    del = require('del'),
    gulpGalen = require('gulp-galenframework');

module.exports = function() {
    
    gulp.add('test:galen', function(done) {

        del.sync([config.paths.dest + config.paths.galen.report]);

        gulp.src(config.paths.src + config.paths.galen.src + '/**/*.test')
            .pipe(gulpGalen.test({
                'htmlreport': config.paths.dest + config.paths.galen.report,
                'parallel-tests': 3,
                'properties': {
                    'galen.default.browser': 'chrome',
                    'webdriver.chrome.driver': './webdrivers/chromedriver.exe',
                    'webdriver.gecko.driver': './webdrivers/geckodriver.exe',
                    'webdriver.edge.driver': './webdrivers/MicrosoftWebDriver.exe',
                    'webdriver.ie.driver': './webdrivers/IEDriverServer.exe',
                    'browserstack.username': 'efocustester',
                    'browserstack.key': 'mMj3qR64dSyC5t244nuS'
                },
                'cwd': '.'
            }, done));
    });

};