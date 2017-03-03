/* globals Maps, google */

(function($, viewport) {
    'use strict';

    /**
     * Loads and displays a Google Map.
     * @class MapsGoogle
     * @author Rocco Janse, rocco.janse@valtech.nl
     * @param {jQueryElement} $element jQuery Element to upgrade with this class.
     * @param {Object} [config] Config object.
     * @param {String|Array} [config.api.url] Url of google maps api.
     * @param {String} [config.api.key] Google Maps api key.
     * @requires AsyncLoader
     */
    var MapsGoogle = function($element, config) {

        // default config
        this.config = {
            api: {
                url: '//maps.googleapis.com/maps/api/js',
                key: 'AIzaSyByqYYEoSA1hQ2MAxXnWe9VyrD_K-3t4Rk'
            },
            map: {
                type: 'roadmap',
                //overlay: 'traffic'
            }
        };

        // extend defaults
        if (config) {
            $.extend(this.config, config);
        }

        // combine url and key for gm api call
        this.config.api.url = this.config.api.url + '?key=' + this.config.api.key;

        // init base class
        Maps.call(this, $element, this.config);

        return this;
    };

    $.extend(MapsGoogle.prototype, Maps.prototype, /** @lends MapsGoogle.prototype */ {

        /**
         * Initializes the map.
         */
        initMap: function() {

            // set default map type
            this.setMapType(this.config.map.type);

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

            // set map overlay
            if (this.config.map.overlay) {
                console.log(this.config.map.overlay);
                this.setOverlays(this.config.map.overlay);
            }
        },

        /**
         * Adds overlay to a map.
         * @param {String} overlay Overlay type name.
         */
        setOverlays: function(overlay) {
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
