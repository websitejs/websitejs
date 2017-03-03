/* globals Maps, H */

(function($, viewport) {
    'use strict';

    /**
     * Loads and displays a Here Map.
     * @class MapsHere
     * @extends Maps
     * @author Rocco Janse, rocco.janse@valtech.nl
     * @param {jQueryElement} $element jQuery Element to upgrade with this class.
     * @param {Object} [config] Config object.
     * @requires AsyncLoader
     */
    var MapsHere = function($element, config) {

        // defaults
        this.config = {
            api: {
                url: ['//js.api.here.com/v3/3.0/mapsjs-core.js', '//js.api.here.com/v3/3.0/mapsjs-service.js'],
                appId: 'PA5BWpI7imMUv5p6FKmT',
                appCode: 'WlAAxVsKrUCYYX8CdqrtZQ'
            },
            map: {
                type: 'normal',
                overlay: 'traffic'
            }
        };

        // extend defaults
        if (config) {
            $.extend(this.config, config);
        }

        // init base class
        Maps.call(this, $element, this.config);

        // vars
        this.platform = null;

        return this;
    };

    $.extend(MapsHere.prototype, Maps.prototype, /** @lends MapsHere.prototype */ {

        /**
         * Initializes the map.
         */
        initMap: function() {

            // authenticate
            this.platform = new H.service.Platform({
                'app_id': this.config.api.appId,
                'app_code': this.config.api.appCode
            });

            // create default layer
            this.defaultLayers = this.platform.createDefaultLayers();

            // set map type to roadmap
            this.setMapType(this.defaultLayers[this.config.map.type].map);

            // Instantiate (and display) a map object:
            this.map = new H.Map(this.$element.find('.map')[0], this.mapType, {
                zoom: this.zoomLevel,
                center: this.mapCenter
            });

            // set map overlay
            if (this.config.map.overlay) {
                this.setOverlays(this.config.map.overlay);
            }

            // this.map = new google.maps.Map(this.$element.find('.map')[0], {
            //     zoom: 7,
            //     center: { lat: 51.44344, lng: 5.46137 },
            //     mapTypeId: google.maps.MapTypeId.ROADMAP,
            //     disableDefaultUI: true,
            //     scrollwheel: false,
            //     draggable: true,
            //     zoomControl: true
            // });
        },

        /**
         * Adds overlay to a map.
         * @param {String} overlay Overlay type name.
         */
        setOverlays: function(overlay) {
            this.map.setBaseLayer(this.defaultLayers[this.config.map.type][overlay]);
        }

    });

    window['MapsHere'] = MapsHere;

    // The component registers itself to the componentHandler in the global scope.
    ComponentHandler.register({
        constructor: MapsHere,
        classAsString: 'MapsHere',
        cssClass: 'js-heremaps'
    });

})(jQuery, window.viewport);
