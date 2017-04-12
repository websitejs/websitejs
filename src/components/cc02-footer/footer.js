(function($, viewport) {
    'use strict';

    /**
     * Footer functionality.
     * @class Footer
     * @param {jQueryElement} $element jQuery Element to upgrade with this class.
     * @author Rocco Janse, rocco.janse@valtech.nl
     
     */
    var Footer = function($element) {
        /** @lends Footer# */

        /**
         * @type {jQueryElement}
         */
        this.$element = $element;

        this.init();
        
        return this;
    };

    $.extend(Footer.prototype, /** @lends Footer# */ {

        /**
         * Initializes component.
         * @public
         */
        init: function() {
            console.log('Inited Footer.');
        }

    });

    window['Footer'] = Footer;

    // The component registers itself to the componentHandler in the global scope.
    ComponentHandler.register({
        constructor: Footer,
        classAsString: 'Footer',
        cssClass: 'js-footer'
    });

})(jQuery, ResponsiveBootstrapToolkit);