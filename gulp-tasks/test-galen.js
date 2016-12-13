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
                    'webdriver.chrome.driver': './node_modules/chromedriver/lib/chromedriver/chromedriver.exe',
                    'webdriver.gecko.driver': './node_modules/geckodriver/geckodriver.exe',
                    'webdriver.edge.driver': './node_modules/edgedriver/lib/edgedriver/MicrosoftWebDriver.exe',
                    'webdriver.ie.driver': './node_modules/iedriver/lib/iedriver64/IEDriverServer.exe',
                    'browserstack.username': 'efocustester',
                    'browserstack.key': 'mMj3qR64dSyC5t244nuS'
                },
                'cwd': '.'
            }, done));
    });

};