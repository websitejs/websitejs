/* globals MapsGoogle */

(function($, viewport) {
    'use strict';

    /**
     * BeterBed storelocator based on Google Maps.
     * @class BeterBedStorelocator
     * @author Rocco Janse, rocco.janse@valtech.nl
     * @param {jQueryElement} $element jQuery Element to upgrade with this class.
     * @param {Object} [options] Config object.
     * @param {String|Array} [options.api.url] Url of google maps api.
     * @param {String} [options.api.key] Google Maps api key.
     * @requires AsyncLoader
     */
    var MapsGoogleStoreLocatorBeterBed = function($element, options) {

        var config = {};

        // init base class
        MapsGoogle.call(this, $element, config);

        console.log(this);

    };

    $.extend(MapsGoogleStoreLocatorBeterBed.prototype, MapsGoogle.prototype/*, Maps.prototype*/, /** @lends MapsGoogle.prototype */ {

        test: function() {

        }



    });


    window['MapsGoogleStoreLocatorBeterBed'] = MapsGoogleStoreLocatorBeterBed;

    // The component registers itself to the componentHandler in the global scope.
    ComponentHandler.register({
        constructor: MapsGoogleStoreLocatorBeterBed,
        classAsString: 'MapsGoogleStoreLocatorBeterBed',
        cssClass: 'js-storelocator-beterbed'
    });

})(jQuery, window.viewport);
