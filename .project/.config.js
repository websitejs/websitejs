'use strict';

var path = require('path'),

    // project name
    projectName = 'WebsiteJS',

    // current working dir
    cwd = '.',

    // gulp
    gulpFolder = 'gulp',
    gulpTaskFolder = 'tasks',

    // roots
    srcFolder = 'src',
    destFolder = 'dist',

    // styles
    srcCssFolder = 'scss',
    destCssFolder = 'css',

    // scripts
    scriptsFilename = 'scripts',
    srcJsFolder = 'js',
    destJsFolder = srcJsFolder,

    // vendor
    vendorFolder = 'vendor',

    // assets
    srcAssetsFolder = 'assets',
    srcFontsFolder = 'fonts',
    srcIconsFolder = 'icons',
    srcSvgIconsFilename = 'svg-icons',
    srcImgFolder = 'img',
    destAssetsFolder = srcAssetsFolder,
    destFontsFolder = srcFontsFolder,
    destIconsFolder = srcIconsFolder,
    destImgFolder = srcImgFolder,

    // elements
    srcElementsFolder = 'elements',
    destElementsFolder = srcElementsFolder,

    // components
    srcComponentsFolder = 'components',
    destComponentsFolder = srcComponentsFolder,

    // styleguide
    styleGuideFolder = 'styleguide',

    // documentation
    docsFolder = 'docs',

    // test output
    testFolder = 'test',
    galenFolder = 'layout';



var Config = module.exports =  {

    name: projectName,

    // gulp
    gulpTaskPath: path.join(cwd, gulpFolder, gulpTaskFolder),

    // roots
    srcPath: srcFolder,
    destPath: destFolder,

    // styles
    srcCssPath: path.join(srcFolder, srcCssFolder),
    destCssPath: path.join(destFolder, destCssFolder),

    // scripts
    scriptsFilename: scriptsFilename,
    srcJsPath: path.join(srcFolder, srcJsFolder),
    destJsPath: path.join(destFolder, destJsFolder),

    // vendor
    destVendorCss: path.join(destFolder, destCssFolder, vendorFolder),
    destVendorJs: path.join(destFolder, destJsFolder, vendorFolder),

    // assets
    srcAssetsPath: path.join(srcFolder, srcAssetsFolder),
    destAssetsPath: path.join(destFolder, srcAssetsFolder),
    srcFontsPath: path.join(srcFolder, srcAssetsFolder, srcFontsFolder),
    destFontsPath: path.join(destFolder, destAssetsFolder, destFontsFolder),
    srcIconsPath: path.join(srcFolder, srcAssetsFolder, srcIconsFolder),
    destIconsPath: path.join(destFolder, destAssetsFolder, destIconsFolder),
    srcSvgIconPath: path.join(srcFolder, srcAssetsFolder, srcIconsFolder, srcSvgIconsFilename),
    destSvgIconPath: path.join(destFolder, destAssetsFolder, destIconsFolder),
    srcImgPath: path.join(srcFolder, srcAssetsFolder, srcImgFolder),
    destImgPath: path.join(destFolder, destAssetsFolder, destImgFolder),

    // elements
    srcElementsPath: path.join(srcFolder, srcElementsFolder),
    destElementsPath: path.join(destFolder, destElementsFolder),

    // components
    srcComponentsPath: path.join(srcFolder, srcComponentsFolder),
    destComponentsPath: path.join(destFolder, destComponentsFolder),

    // styleguide
    destStyleguidePath: path.join(destFolder, styleGuideFolder),

    // docs
    destDocsPathJs: path.join(destFolder, docsFolder, destJsFolder),
    destDocsPathCss: path.join(destFolder, docsFolder, destCssFolder),

    // galen
    destGalenReportLayout: path.join(destFolder, testFolder, galenFolder)
};
