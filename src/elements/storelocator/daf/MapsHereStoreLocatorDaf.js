/* globals MapsHere */

(function($, viewport) {
    'use strict';

    /**
     * DAF storelocator based on Here Maps.
     * @class MapsGoogleStorelocatorDaf
     * @author Rocco Janse, rocco.janse@valtech.nl
     * @param {jQueryElement} $element jQuery Element to upgrade with this class.
     * @param {Object} [options] Config object.
     * @param {String|Array} [options.api.url] Url of google maps api.
     * @param {String} [options.api.key] Google Maps api key.
     * @requires AsyncLoader
     */
    var MapsHereStoreLocatorDaf = function($element, options) {

        var config = {};

        // init base class
        MapsHere.call(this, $element, config);

        console.log('DAF StoreLocator', this);

    };

    $.extend(MapsHereStoreLocatorDaf.prototype, MapsHere.prototype/*, Maps.prototype*/, /** @lends MapsGoogle.prototype */ {

        test: function() {

        }



    });


    window['MapsHereStoreLocatorDaf'] = MapsHereStoreLocatorDaf;

    // The component registers itself to the componentHandler in the global scope.
    ComponentHandler.register({
        constructor: MapsHereStoreLocatorDaf,
        classAsString: 'MapsHereStoreLocatorDaf',
        cssClass: 'js-storelocator-daf'
    });

})(jQuery, window.viewport);
