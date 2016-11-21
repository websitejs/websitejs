(function ($, viewport) {
    'use strict';

    /**
     * Class for Footer component
     * @author Rocco Janse <roccojanse@outlook.com>
     *
     * @param {HTMLElement} element The element that will be upgraded.
     * @class Footer
     */
    var Footer = function Footer(element) {
        
        this.element_ = element;

        // Initialize instance.
        this.init();
    };

    window['Footer'] = Footer;

})(jQuery, ResponsiveBootstrapToolkit);