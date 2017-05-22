$(document).ready(function() {
    'use strict';

    // // SVG system inject
    // var svgUrlPrefix = '/',
    //     svgUrl = '/assets/icons/svg-icons.svg',
    //     scripts = document.getElementsByTagName('script'),
    //     script = scripts[scripts.length - 1],
    //     xhr = new XMLHttpRequest();

    // xhr.onload = function () {
    //     var div = document.createElement('div');
    //     div.innerHTML = this.responseText;
    //     div.style.display = 'none';
    //     script.parentNode.insertBefore(div, script);
    // };

    // if (window.location.hostname !== 'localhost') {
    //     svgUrlPrefix = '/static/2.0';
    // }

    // xhr.open('get', svgUrlPrefix + svgUrl, true);
    // xhr.send();

    // init global vieport var
    if (typeof window.viewport === 'undefined') {
        window.viewport = ResponsiveBootstrapToolkit;
    }

    // upgrade DOM with registerd elements/components
    ComponentHandler.upgradeAllRegistered();

    // custom components inits
    var gmaps = $('.js-custom-maps');
    if (gmaps.length > 0) {
        $.each(gmaps, function(i, map) {
            new window.GoogleMaps($(map), {
                api: {
                    url: [
                        '//maps.googleapis.com/maps/api/js',
                        '/js/vendor/googlemaps.min.js'
                    ],
                    key: 'AIzaSyByqYYEoSA1hQ2MAxXnWe9VyrD_K-3t4Rk'
                },
                map: {
                    type: 'hybrid',
                    //overlay: 'traffic'
                    disableDefaultUI: true,
                    clustering: false
                }
            }).init();
        });
    }

    var hmaps = $('.js-custom-heremaps');
    if (hmaps.length > 0) {
        $.each(hmaps, function(i, map) {
            new window.HereMaps($(map), {
                api: {
                    url: ['//js.api.here.com/v3/3.0/mapsjs-core.js', '//js.api.here.com/v3/3.0/mapsjs-service.js'],
                    appId: 'PA5BWpI7imMUv5p6FKmT',
                    appCode: 'WlAAxVsKrUCYYX8CdqrtZQ'
                },
                map: {
                    type: 'satellite',
                    overlay: 'traffic',
                    disableDefaultUI: false,
                    clustering: false
                }
            }).init();
        });
    }

    console.log('ready.');
});
