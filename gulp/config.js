'use strict';

module.exports =  {

    name: 'DAF2.0',

    gulpTaskPath: './gulp/tasks',

    srcPath: 'src',
    destPath: 'dist',
    docsPath: 'docs',

    tplCssPath: '/css',
    tplJsPath: '/js',

    jsFilename: 'scripts',

    vendor: {
        'jquery': [
            "node_modules/jquery/dist/jquery.min.js"
        ],
        'bootstrap': [
            "node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js",
            "node_modules/responsive-toolkit/dist/bootstrap-toolkit.min.js"
        ],
        'libs': [
            "node_modules/js-cookie/src/js.cookie.js",
            "node_modules/@material/ripple/dist/mdc.ripple.min.js"
        ]
    }

};
