'use strict';

module.exports =  {

    name: 'WebsiteJS',

    gulpTaskPath: './gulp/tasks',

    srcPath: 'src',
    destPath: 'dist',
    docsPath: 'docs',

    vendor: {
        'jquery': [
            "node_modules/jquery/dist/jquery.min.js"
        ],
        'bootstrap': [
            "node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js",
            "node_modules/responsive-toolkit/dist/bootstrap-toolkit.min.js"
        ],
        'libs': [
            "node_modules/js-cookie/src/js.cookie.js"
        ]
    }

};
