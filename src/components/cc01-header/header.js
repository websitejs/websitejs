(function($, viewport) {
    'use strict';

    /**
     * Header functionality.
     * @class Header
     * @param {jQueryElement} $element jQuery Element to upgrade with this class.
     * @author Rocco Janse, rocco.janse@valtech.nl
     
     */
    var Header = function($element) {
        /** @lends Header# */

        /**
         * @type {jQueryElement}
         */
        this.$element = $element;

        // this.init();
        
        return this;
    };

    $.extend(Header.prototype, /** @lends Header# */ {

        /**
         * Initializes component.
         * @public
         */
        init: function() {
            console.log('Inited Header.', this);
        }

    });

    window['Header'] = Header;

    // The component registers itself to the componentHandler in the global scope.
    ComponentHandler.register({
        constructor: Header,
        classAsString: 'Header',
        cssClass: 'js-header'
    });

})(jQuery, window.viewport);