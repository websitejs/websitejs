$(document).ready(function() {
    'use strict';

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