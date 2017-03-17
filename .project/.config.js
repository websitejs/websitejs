'use strict';

var srcPath = 'src',
    destPath = 'dist';

module.exports =  {

    name: 'DAF2.0',

    gulpTaskPath: './gulp/tasks',

    // source
    srcPath: srcPath,
    destPath: destPath,

    // styles
    srcCssPath: srcPath + '/scss',
    destCssPath: destPath + '/css',

    // scripts
    scriptsFilename: 'scripts',
    srcJsPath: srcPath + '/js',
    destJsPath: destPath + '/js',

    // vendor
    destVendorCss: destPath + '/css/vendor',
    destVendorJs: destPath + '/js/vendor',

    // assets
    srcSvgIconPath: srcPath + '/assets/icons/svg-icons',
    destSvgIconPath: destPath + '/assets/icons',

    // elements
    srcElementsPath: srcPath + '/elements',
    destElementsPath: destPath + '/elements',

    // components
    srcComponentsPath: srcPath + '/components',
    destComponentsPath: destPath + '/components',

    // styleguide
    destStyleguidePath: destPath + '/styleguide',

    // docs
    destDocsPathJs: destPath + '/docs/scripts',
    destDocsPathCss: destPath + '/docs/styles',

    // galen
    destGalenReportLayout: destPath + '/test/layout'
};
