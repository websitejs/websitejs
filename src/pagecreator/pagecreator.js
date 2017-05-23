'use strict';

var express = require('express'),
    http = require('http'),
    path = require('path'),
    nunjucks = require('nunjucks'),
    browserSync = require('browser-sync'),
    bs = browserSync.create().init({ logSnippet: false }),
    app = express(),

    paths = {
        views: path.join(__dirname, 'views'),
        routers: path.join(__dirname, 'routers')
    };

// let app use browsersync
app.use(require('connect-browser-sync')(bs));

// configure nunjucks
nunjucks.configure(paths.views, {
    autoescape: true,
    express: app
});

// routers
var routers = {
    auth: require(paths.routers + '/auth')
};

//app.get('/', routes.index);

// routing
app.get('/', function(req, res) {
    //console.log(res);
    res.render('index.html', { title: 'PAGECREATORRRR' });
});

app.use('/auth', routers.auth);

var port = 3000;
http.createServer(app).listen(port, function() {
  console.log('Listening on port ' + port + '...');
});
