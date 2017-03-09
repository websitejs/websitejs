/* globals AsyncLoader */

(function($, viewport) {
    'use strict';

    /**
     * Base class for loading and displaying a map.
     * @class Maps
     * @author Rocco Janse, rocco.janse@valtech.nl
     * @param {jQueryElement} $element jQuery Element to upgrade with this class.
     * @param {config} options Config object.
     * @requires AsyncLoader
     */
    var Maps = function($element, config) {

        this.config = {
            api: {
                url: [],
                language: 'nl-NL',
                region: 'NL'
            },
            map: {
                type: 'normal',
                overlay: null,
                disableDefaultUI: false,
                zoomLevel: 7,
                clustering: false
            }
        };

        if (config) {
            this.config = $.extend(true, this.config, config);
        }

        this.$element = $element;
        this.map = null;
        this.language = this.config.api.language;
        this.region = this.config.api.region;
        this.zoomLevel = this.config.map.zoomLevel;
        this.mapCenter = { lat: 52.2129919, lng: 5.2793703 };
        this.mapType = this.config.map.type;
        this.disableDefaultUI = this.config.map.disableDefaultUI;
        this.clustering = this.config.map.clustering;
        this.scrollwheel = false;
        this.draggable = true;
        this.zoomControl = true;

        this.markers = [];
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
            AsyncLoader.load(this.config.api.url, function() {
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

        /**
         * Returns marker data object from request.
         * @param {string} url Url where API is located on.
         * @param {object} data Data to send to request url.
         * @param {functon} [cb] Callback function.
         */
        getMarkerData: function(url, data, cb) {
            $.ajax({
                url: url,
                data: data,
                type: 'GET',
                dataType: 'json'
            })
            .done(function(response) {
                if (typeof cb === 'function') {
                    cb(response);
                }
            })
            .fail( function(d, textStatus, error) {
                console.error("getJSON failed, status: " + textStatus + ", error: "+error);
            });
        }


    });

    window['Maps'] = Maps;

})(jQuery, window.viewport);
