(function($, viewport) {
    'use strict';

    /**
     * Class for Footer component
     * @author Rocco Janse <roccojanse@outlook.com>
     *
     * @param {HTMLElement} element The element that will be upgraded.
     * @class Footer
     */
    var Footer = function(element) {
        
        var $element = element;

        /**
         * Initializes component
         * @public
         */
        this.init = function() {
            console.log('Inited Footer.');
        };

        // Initialize instance.
        this.init();
    };

    window['Footer'] = Footer;

    // The component registers itself to the componentHandler in the global scope.
    componentHandler.register({
        constructor: Footer,
        classAsString: 'Footer',
        cssClass: 'js-footer'
    });

})(jQuery, ResponsiveBootstrapToolkit);