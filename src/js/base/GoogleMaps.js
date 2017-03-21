/* globals google, Maps, AsyncLoader, MarkerClusterer */

(function($, viewport) {
    'use strict';

    /**
     * Loads and displays a Google Map.
     * @class GoogleMaps
     * @author Rocco Janse, rocco.janse@valtech.nl
     * @param {jQueryElement} $element jQuery Element to upgrade with this class.
     * @param {Object} [options] Config object.
     * @param {String|Array} [options.api.url] Url of google maps api.
     * @param {String} [options.api.key] Google Maps api key.
     * @requires AsyncLoader.js
     * @requires Maps.js
     */
    var GoogleMaps = function($element, options) {

        // default config
        var config = {
            markerDataUrl: null,
            api: {
                url: [
                    '//maps.googleapis.com/maps/api/js',
                    '/js/vendor/googlemaps.min.js'
                ],
                key: 'AIzaSyByqYYEoSA1hQ2MAxXnWe9VyrD_K-3t4Rk',
                language: 'nl-NL',
                region: 'NL'
            },
            map: {
                type: 'roadmap',
                defaultUI: true,
                clustering: false
            }
        };

        // get center and zoomlevel from elemens' data attributes
        if ($element.attr('data-mapcenter')) {
            config.map.center =  {
                lat: parseFloat($element.attr('data-mapcenter').split(',')[0]),
                lng: parseFloat($element.attr('data-mapcenter').split(',')[1])
            };
        }
        if ($element.attr('data-zoomlevel')) {
            config.map.zoomLevel = parseInt($element.attr('data-zoomlevel'));
        }
        if ($element.attr('data-markerpos')) {
            this.markerPos = {
                lat: parseFloat($element.attr('data-markerpos').split(',')[0]),
                lng: parseFloat($element.attr('data-markerpos').split(',')[1])
            };
        }

        // extend defaults and overwrite current config
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

        // vars
        this.markerClusterer = null;

        return this;
    };

    $.extend(GoogleMaps.prototype, Maps.prototype, /** @lends GoogleMaps.prototype */ {

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
                center: this.mapCenter,
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
         * Always runs when map is initialized.
         * Startpoint for logic.
         */
        initialized: function() {

            // set initial marker, if set in element attribute
            if (this.markerPos) {
                this.addMarker(this.markerPos);
            }

            console.log('initialized!');
        },

        /**
         * Adds Google Maps events to map.
         * @param {string} event Event name.
         * @param {function} cb Function to execute when triggered.
         * @param {boolean} [once] Set this to true to trigger event only once.
         */
        addMapEventListener: function(event, cb, once) {
            if (once === true) {
                google.maps.event.addListenerOnce(this.map, event, cb);
            } else {
                google.maps.event.addListener(this.map, event, cb);
            }
        },

        /**
         * Adds an overlay to a map.
         * @param {String} overlay Overlay type name.
         */
        setOverlay: function(overlay) {
            switch(overlay) {
                case 'traffic': {
                    this.trafficLayer = new google.maps.TrafficLayer();
                    this.trafficLayer.setMap(this.map);
                    break;
                }
                default: {
                    break;
                }
            }
        },

        getMapBounds: function() {
            return this.map.getBounds();
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

    window['GoogleMaps'] = GoogleMaps;

    // The component registers itself to the componentHandler in the global scope.
    ComponentHandler.register({
        constructor: GoogleMaps,
        classAsString: 'GoogleMaps',
        cssClass: 'js-googlemaps'
    });

})(jQuery, ResponsiveBootstrapToolkit);
