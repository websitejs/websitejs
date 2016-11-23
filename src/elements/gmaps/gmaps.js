(function($, viewport) {
    'use strict';

    /**
     * Loads and displays a Google Map.
     * @class Maps
     * @param {jQueryElement} $element jQuery Element to upgrade with this class.
     * @author Rocco Janse, rocco.janse@valtech.nl
     
     */
    var Maps = function($element) {
        /** @lends Maps# */

        /**
         * @type {jQueryElement}
         */
        this.$element = $element;

        this.init();
        
        return this;
    };

    $.extend(Maps.prototype, /** @lends Maps# */ {

        /**
         * Initializes component.
         * @public
         */
        init: function() {
            console.log('Inited Google Maps.');
        }

    });

    window['Maps'] = Maps;

    // The component registers itself to the componentHandler in the global scope.
    componentHandler.register({
        constructor: Maps,
        classAsString: 'Maps',
        cssClass: 'js-maps'
    });

})(jQuery, ResponsiveBootstrapToolkit);