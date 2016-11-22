(function($, viewport) {
    'use strict';

    /**
     * Class for Header component
     * @author Rocco Janse <roccojanse@outlook.com>
     *
     * @param {HTMLElement} element The element that will be upgraded.
     * @class Header
     */
    var Header = function(element) {
        
        var $element = element;

        // Initialize instance.
        this.init();
    };

    window['Header'] = Header;

    // The component registers itself to the componentHandler in the global scope.
    componentHandler.register({
        constructor: Header,
        classAsString: 'Header',
        cssClass: 'js-header'
    });

    console.log('header', componentHandler);
    
})(jQuery, ResponsiveBootstrapToolkit);