'use strict';

var config = require('../../.project/.config');

module.exports =  {

    // styleguide paths
    cssPath: config.destCssPath.replace(config.destPath, ''),
    jsPath: config.destJsPath.replace(config.destPath, ''),

    assetsPath: {
        svgIcons: config.srcSvgIconPath.replace(config.srcPath, '') + '.svg'
    }

};
