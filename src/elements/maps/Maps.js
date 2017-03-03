/* globals AsyncLoader */

(function($, viewport) {
    'use strict';

    /**
     * Base class for loading and displaying a map.
     * @class Maps
     * @author Rocco Janse, rocco.janse@valtech.nl
     * @param {jQueryElement} $element jQuery Element to upgrade with this class.
     * @param {object} options Options object.
     * @requires AsyncLoader
     */
    var Maps = function($element, options) {

        this.config = {
            api: {
                url: []
            }
        };

        if (options) {
            $.extend(this.config, options);
        }

        this.$element = $element;
        this.map = null;

        this.zoomLevel = 7;
        this.mapCenter = { lat: 51.44344, lng: 5.46137 };
        this.mapType = null;
        this.disableDefaultUI = true;
        this.scrollwheel = false;
        this.draggable = true;
        this.zoomControl = true;

        return this;
    };

    $.extend(Maps.prototype, /** @lends Maps.prototype */ {

        /**
         * Loads depended api's and inits map.
         * @public
         */
        init: function() {

            var _this = this;

            // async load maps api
            AsyncLoader.loadScript(this.config.api.url, function() {
                _this.initMap();
            });
        },

        initMap: function() { console.error('Maps base class should be extended.'); },

        /**
         * Sets Map type
         * @param {String} type Map type.
         */
        setMapType: function(type) {
            this.mapType = type;
        },

        setOverlays: function() {}

    });

    window['Maps'] = Maps;

})(jQuery, window.viewport);
