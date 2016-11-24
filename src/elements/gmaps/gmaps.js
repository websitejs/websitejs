/* globals google */

(function($, viewport) {
    'use strict';

    /**
     * Loads and displays a Google Map.
     * @class Maps
     * @author Rocco Janse, rocco.janse@valtech.nl
     * @param {jQueryElement} $element jQuery Element to upgrade with this class.
     * @requires AsyncLoader
     */
    var Maps = function($element) {

        this.api = {
            url: '//maps.googleapis.com/maps/api/js',
            key: 'AIzaSyByqYYEoSA1hQ2MAxXnWe9VyrD_K-3t4Rk'
        };

        this.$element = $element;
        this.map = null;

        // init
        this.init();
        
        return this;
    };

    $.extend(Maps.prototype, /** @lends Maps.prototype */ {

        /**
         * Loads google maps api and initializes component.
         * @public
         */
        init: function() {

            var _this = this;

            // async load google maps if necessary
            AsyncLoader.loadScript(this.api.url + '?key=' + this.api.key, function() {
                _this.setMap();
            });

        },

        setMap: function() {
            this.map = new google.maps.Map(this.$element.find('.map')[0], {
                zoom: 7,
                center: { lat: 51.44344, lng: 5.46137 },
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true,
                scrollwheel: false,
                draggable: true, 
                zoomControl: true
            });
        }

    });

    window['Maps'] = Maps;

    // The component registers itself to the componentHandler in the global scope.
    ComponentHandler.register({
        constructor: Maps,
        classAsString: 'Maps',
        cssClass: 'js-maps'
    });

})(jQuery, window.viewport);