(function ($, viewport) {
    'use strict';

    /**
     * Class for Header component
     * @author Rocco Janse <roccojanse@outlook.com>
     *
     * @param {HTMLElement} element The element that will be upgraded.
     * @class Header
     */
    var Header = function Header(element) {
        
        this.element_ = element;

        // Initialize instance.
        this.init();
    };

    window['Header'] = Header;
    
})(jQuery, ResponsiveBootstrapToolkit);