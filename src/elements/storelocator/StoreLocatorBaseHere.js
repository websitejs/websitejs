/* globals HereMaps */

(function($, viewport) {
    'use strict';

    /**
     * Storelocator base class.
     * @class StoreLocatorBaseHere
     * @author Rocco Janse, rocco.janse@valtech.nl
     * @param {jQueryElement} $element jQuery Element to upgrade with this class.
     * @param {Object} [options] Config object.
     * @param {String|Array} [options.api.url] Url of google maps api.
     * @param {String} [options.api.key] Google Maps api key.
     * @requires ../../js/base/HereMaps.js
     */
    var StoreLocatorBaseHere = function($element, options) {

        // create config object
        var config = {
            api: {
                language: 'nl-NL',
                region: 'NL'
            },
            map: {
                type: 'normal',
                overlay: null,
                disableDefaultUI: true,
                clustering: true
            }
        };

        // extend defaults and overwrite current config
        if (options) {
            config = $.extend(true, config, options);
        }

        // instantiate maps class, bound to 'this'
        HereMaps.call(this, $element, config);

        // init resultlist
        this.$resultsList = $element.find('.resultslist');
        this.$resultHtmlTpl = this.$resultsList.find('.tpl');

        // icons
        this.markerIcons = [];

        console.log(this);

    };

    $.extend(StoreLocatorBaseHere.prototype, HereMaps.prototype, /** @lends StoreLocatorBaseHere.prototype */ {

        /**
         * Runs directly after map initialization.
         */
        initialized: function() {

            var _this = this;

            // get marker data
            this.getMarkerData(this.config.markerDataUrl, {}, function(markerData) {

                // create markers of data results
                for (var i = 0; i < markerData.Dealers.Dealer.length; i++) {

                    var dealer = markerData.Dealers.Dealer[i];


                    // marker icon and position
                    var icon = _this.markerIcons[Math.floor(Math.random() * _this.markerIcons.length)],
                        position = { lat: parseFloat(dealer.Latitude), lng: parseFloat(dealer.Longitude) };

                    // add marker to marker array an add it to the map
                    _this.markers.push(_this.addMarker(position, icon, dealer));
                }

                // if clustering is on, add clusterer layer
                if (_this.clustering) {
                    _this.setMarkerClusterer(_this.markers, 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m');
                }

                _this.updateResultsList();

            });

        },

        /**
         * Updates result list. Shows only markers within bounds of current map.
         */
        updateResultsList: function() {

            var currentMapBounds = this.getMapBounds();
            console.log(currentMapBounds);
            for (var i = 0; i < this.markers.length; i++) {

                if (currentMapBounds.contains(this.markers[i].getPosition())) {
                    console.log(this.markers[i].data, 'IN VIEWPORT');
                }
            }

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

    window['StoreLocatorBaseHere'] = StoreLocatorBaseHere;

})(jQuery, ResponsiveBootstrapToolkit);
