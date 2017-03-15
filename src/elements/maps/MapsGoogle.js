/* globals Maps, google, AsyncLoader, MarkerClusterer */

(function($, viewport) {
    'use strict';

    /**
     * Loads and displays a Google Map.
     * @class MapsGoogle
     * @author Rocco Janse, rocco.janse@valtech.nl
     * @param {jQueryElement} $element jQuery Element to upgrade with this class.
     * @param {Object} [options] Config object.
     * @param {String|Array} [options.api.url] Url of google maps api.
     * @param {String} [options.api.key] Google Maps api key.
     * @requires AsyncLoader
     */
    var MapsGoogle = function($element, options) {

        // default config
        var config = {
            markerDataUrl: null,
            api: {
                url: [
                    '//maps.googleapis.com/maps/api/js',
                    '/js/vendor/googlemaps.min.js'
                ],
                language: 'nl-NL',
                region: 'NL'
            },
            map: {
                type: 'roadmap',
                defaultUI: true,
                clustering: false
            }
        };

        // extend defaults
        if (options) {
            config = $.extend(true, config, options);
        }

        // combine url and key for gm api call
        var url = config.api.url[0];
        if (config.api.key) { url += '?key=' + config.api.key; }
        if (config.api.language) { url += '&language=' + config.api.language; }
        if (config.api.region) { url += '&region=' + config.api.region; }
        config.api.url[0] = url;

        // init base class
        Maps.call(this, $element, config);

        this.markerClusterer = null;

        return this;
    };

    $.extend(MapsGoogle.prototype, Maps.prototype, /** @lends MapsGoogle.prototype */ {

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

        /**
         * Initializes the map.
         */
        initMap: function() {

            var _this = this;

           // define map
            this.map = new google.maps.Map(this.$element.find('.map')[0], {
                zoom: this.zoomLevel,
                //center: this.mapCenter,
                mapTypeId: this.mapType,
                disableDefaultUI: this.disableDefaultUI,
                scrollwheel: this.scrollwheel,
                draggable: this.draggable,
                zoomControl: this.zoomControl
            });
            this.setMapCenter(this.mapCenter);

            // set map overlay
            if (this.config.map.overlay) {
                this.setOverlay(this.config.map.overlay);
            }

            // call initialized method
            google.maps.event.addListenerOnce(this.map, 'idle', function() {
                _this.initialized();
            });
        },

        /**
         * Adds overlay to a map.
         * @param {String} overlay Overlay type name.
         */
        setOverlay: function(overlay) {
            switch(overlay) {
                case 'traffic': {
                    this.trafficLayer = new google.maps.TrafficLayer();
                    this.trafficLayer.setMap(this.map);
                    console.log(this.map);
                    break;
                }
                default: {
                    break;
                }
            }
        },

        /**
         * Adds a marker to a map.
         * @param {object} coords Lat/lng coordinates.
         * @param {string} icon Path to image or html/svg string.
         * @param {object} [data] Object for custom data.
         */
        addMarker: function(coords, icon, data) {
            if (typeof data === 'undefined') {
                data = {};
            }
            return new google.maps.Marker({
                icon: icon,
                position: coords,
                map: this.map,
                data: data
            });
        },

        /**
         * Initializes Marker Clustering.
         * @param {array} markers Markers to cluster.
         * @param {string} imgPath Path to cluster icon.
         */
        setMarkerClusterer: function(markers, imgPath) {
            this.markerClusterer = new MarkerClusterer(this.map, markers, {
                imagePath: imgPath
            });
        }

    });

    window['MapsGoogle'] = MapsGoogle;

    // The component registers itself to the componentHandler in the global scope.
    ComponentHandler.register({
        constructor: MapsGoogle,
        classAsString: 'MapsGoogle',
        cssClass: 'js-googlemaps'
    });

})(jQuery, window.viewport);
