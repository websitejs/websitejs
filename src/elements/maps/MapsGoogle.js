/* globals Maps, google */

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
            markerDataUrl: '/styleguide/elements/maps/data.json',
            api: {
                url: '//maps.googleapis.com/maps/api/js',
                key: 'AIzaSyByqYYEoSA1hQ2MAxXnWe9VyrD_K-3t4Rk',
                language: 'nl-NL',
                region: 'NL'
            },
            map: {
                type: 'roadmap',
                defaultUI: true,
                clustring: true
            }
        };

        // extend defaults
        if (options) {
            config = $.extend(true, config, options);
        }

        // combine url and key for gm api call
        var url = config.api.url;
        if (config.api.key) { url += '?key=' + config.api.key; }
        if (config.api.language) { url += '&language=' + config.api.language; }
        if (config.api.region) { url += '&region=' + config.api.region; }
        config.api.url = url;

        // init base class
        Maps.call(this, $element, config);

        return this;
    };

    $.extend(MapsGoogle.prototype, Maps.prototype, /** @lends MapsGoogle.prototype */ {

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
            this.map.setCenter(this.mapCenter);

            // set map overlay
            if (this.config.map.overlay) {
                this.setOverlays(this.config.map.overlay);
            }

            // marker data
            this.getMarkerData(this.config.markerDataUrl, {}, function(markerData) {
                for (var i = 0; i < markerData.dealers.length; i++) {
                    var icons = [
                        '/assets/img/maps/marker-bustour.png',
                        '/assets/img/maps/marker-communitycentre.png',
                        '/assets/img/maps/marker-conveniencestore.png'/*,
                        '<svg version="1.1" width="25" height="25" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 504 504" style="enable-background:new 0 0 504 504;" xml:space="preserve">' +
                                '<circle style="fill:#324A5E;" cx="252" cy="252" r="252"/>' +
                                '<g><path style="fill:#E6E9EE;" d="M345.6,382.3c-39.1,0-71-31.8-71-71s31.8-71,71-71s71,31.8,71,71S384.8,382.3,345.6,382.3zM345.6,260.2c-28.2,0-51.2,23-51.2,51.2s23,51.2,51.2,51.2s51.2-23,51.2-51.2C396.8,283.1,373.8,260.2,345.6,260.2z"/>' +
	                            '<path style="fill:#E6E9EE;" d="M160.3,382.3c-39.1,0-71-31.8-71-71s31.8-71,71-71s71,31.8,71,71S199.4,382.3,160.3,382.3zM160.3,260.2c-28.2,0-51.2,23-51.2,51.2s23,51.2,51.2,51.2s51.2-23,51.2-51.2C211.4,283.1,188.5,260.2,160.3,260.2z"/></g>'+
                                '<path style="fill:#4CDBC4;" d="M360.9,308.3l-43.3-105.6l23-36.3c2.9-4.6,1.6-10.7-3.1-13.7c-4.6-2.9-10.7-1.6-13.7,3.1l-24.9,39.3c-0.2,0.3-0.3,0.6-0.4,0.9h-94.1c1.7-22.9-0.2-47.4-8.3-71.8h38.8c5.5,0,9.9-4.4,9.9-9.9s-4.4-9.9-9.9-9.9H132c-5.5,0-9.9,4.4-9.9,9.9s4.4,9.9,9.9,9.9h42.9c32.4,84.6-24.8,176.8-25.6,178.1c-2.9,4.6-1.6,10.7,3,13.7c1.6,1,3.5,1.5,5.3,1.5c3.3,0,6.5-1.6,8.4-4.6c1.7-2.7,27.1-43.4,35.9-97.1h99.5l41,100c1.6,3.8,5.3,6.1,9.2,6.1c1.3,0,2.5-0.2,3.8-0.7C360.5,319.1,362.9,313.3,360.9,308.3z"/>' +
                                '<path style="fill:#FF7058;" d="M366.7,164.9h-69.9c-5.5,0-9.9-4.4-9.9-9.9s4.4-9.9,9.9-9.9h69.9c5.5,0,9.9,4.4,9.9,9.9S372.1,164.9,366.7,164.9z"/></svg>'*/
                    ];
                    var icon = icons[Math.floor(Math.random()*icons.length)];
                    var position = markerData.dealers[i].latLng.split(',');
                    _this.addMarker({ lat: parseFloat(position[0]), lng: parseFloat(position[1])}, icon);
                }
            });
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
        },

        /**
         * Adds a marker to a map.
         * @param {object} coords Lat/lng coordinates.
         * @param {sring} icon Path to image or html/svg string.
         */
        addMarker: function(coords, icon) {
            new google.maps.Marker({
                icon: icon,
                position: coords,
                map: this.map
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
