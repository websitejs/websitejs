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

    // var newQueryString = QueryStringHandler.updateParams('?type=matrassen&width=200&length=220&page=3&numresults=12&sortmethod=name-asc&color=blue,yellow,green&test=');
    // QueryStringHandler.updateUrl(newQueryString);
			$('.test a').on('click', function(e) {
				e.preventDefault();
                var newUrl = QueryStringHandler.updateParams($(this).attr('href'));
				QueryStringHandler.updateUrl(newUrl);
			});

    // upgrade DOM with registerd elements/components
    ComponentHandler.upgradeAllRegistered();

    console.log('ready.');
});
