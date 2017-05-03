'use strict';

var Config = module.exports =  {

    name: 'DAF2.0',

    gulpTaskPath: './gulp/tasks',

    // source
    srcPath: 'src',
    destPath: 'dist',

    // styles
    srcCssPath: Config.srcPath + '/scss',
    destCssPath: Config.destPath + '/css',

    // scripts
    scriptsFilename: 'scripts',
    srcJsPath: Config.srcPath + '/js',
    destJsPath: Config.destPath + '/js',

    // vendor
    destVendorCss: Config.destPath + '/css/vendor',
    destVendorJs: Config.destPath + '/js/vendor',

    // assets
    svgIconPath: '/assets/icons/svg-icons',
    srcSvgIconPath: Config.srcPath + Config.svgIconPath,
    destSvgIconPath: Config.destPath + '/assets/icons',

    // elements
    srcElementsPath: Config.srcPath + '/elements',
    destElementsPath: Config.destPath + '/elements',

    // components
    srcComponentsPath: Config.srcPath + '/components',
    destComponentsPath: Config.destPath + '/components',

    // styleguide
    destStyleguidePath: Config.destPath + '/styleguide',

    // docs
    destDocsPathJs: Config.destPath + '/docs/scripts',
    destDocsPathCss: Config.destPath + '/docs/styles',

    // galen
    destGalenReportLayout: Config.destPath + '/test/layout'
};
