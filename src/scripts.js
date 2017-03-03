$(document).ready(function() {
    'use strict';

    // SVG system inject
    var scripts = document.getElementsByTagName('script');
    var script = scripts[scripts.length - 1];
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        var div = document.createElement('div');
        div.innerHTML = this.responseText;
        div.style.display = 'none';
        script.parentNode.insertBefore(div, script);
    };
    xhr.open('get', '/assets/icons/svg-icons.svg', true);
    xhr.send();

    // init global vieport var
    if (typeof window.viewport === 'undefined') {
        window.viewport = ResponsiveBootstrapToolkit;
    }

    /**
     * homepage demo; should be removed!
     */
    // var newQueryString = QueryStringHandler.updateParams('?type=matrassen&width=200&length=220&page=3&numresults=12&sortmethod=name-asc&color=blue,yellow,green&test=');
    // QueryStringHandler.updateUrl(newQueryString);
			$('.test a').on('click', function(e) {
				e.preventDefault();
                var newUrl = QueryStringHandler.updateParams($(this).attr('href'));
				QueryStringHandler.updateUrl(newUrl);
			});

    // upgrade DOM with registerd elements/components
    ComponentHandler.upgradeAllRegistered();


    // custom components inits
    var gmaps = $('.js-custom-maps');
    if (gmaps.length > 0) {
        $.each(gmaps, function(i, map) {
            new window.MapsGoogle($(map), {
                api: {
                    url: '//maps.googleapis.com/maps/api/js',
                    key: 'AIzaSyByqYYEoSA1hQ2MAxXnWe9VyrD_K-3t4Rk'
                },
                map: {
                    type: 'hybrid',
                    //overlay: 'traffic'
                }
            }).init();
        });
    }

    var hmaps = $('.js-custom-heremaps');
    if (hmaps.length > 0) {
        $.each(hmaps, function(i, map) {
            new window.MapsHere($(map), {
                api: {
                    url: ['//js.api.here.com/v3/3.0/mapsjs-core.js', '//js.api.here.com/v3/3.0/mapsjs-service.js'],
                    appId: 'PA5BWpI7imMUv5p6FKmT',
                    appCode: 'WlAAxVsKrUCYYX8CdqrtZQ'
                },
                map: {
                    type: 'satellite',
                    overlay: 'traffic'
                }
            }).init();
        });
    }

    console.log('ready.');
});
