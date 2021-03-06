'use strict';

var config = require('../../.project/.config'),
    gulp = require('gulp'),
    del = require('del'),
    gulpGalen = require('gulp-galenframework');

module.exports = function() {

    gulp.add('test:galen', function(done) {

        del.sync([config.galenReport], { force: true });

        gulp.src(config.destStyleguidePath + '/**/*.test')
            .pipe(gulpGalen.test({
                'htmlreport': config.destGalenReportLayout,
                //'parallel-tests': 3,
                'properties': {
                    'galen.default.browser': 'chrome',
                    'galen.use.fail.exit.code': false,
                    'webdriver.chrome.driver': './node_modules/chromedriver/lib/chromedriver/chromedriver.exe',
                    'webdriver.gecko.driver': './webdrivers/geckodriver.exe',
                    'webdriver.edge.driver': './webdrivers/MicrosoftWebDriver.exe',
                    'webdriver.ie.driver': './node_modules/iedriver/lib/iedriver64/IEDriverServer.exe'
                },
                'cwd': '.'
            }, done()));

    });

};
