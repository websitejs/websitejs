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
            this.calculateButtonWidth();
            this.dropdownFirstLevel();
        }, 

        /* 
        * calculate buttons width total,
        * to determine if the standard menu or menu with more button should be shown.
        */
        calculateButtonWidth: function() { 
            // check if width is more then max container width of page - take predefined widths of the styleguide
            // if it's less, show first part js-all-buttons
            // if it's more, show second part js-more-button

            var buttonWidth = 0;
            $('.menu-item').each(function(index, value) {
                buttonWidth += parseInt($(this).outerWidth());

                // PUT IF STATEMENT OUTSIDE OF EACH LOOP
                if(buttonWidth > $('.navbar__standard-menu').width() || viewport.is('<sm')) {
                    // TOGGLE CLASS, NOT STYLE 
                    $('.navbar__standard-menu').css('display', 'none');
                    $('.navbar__more-menu').css('display', 'block');
                } else {
                    $('.navbar__standard-menu').css('opacity', '1');
                }
            });

        },

        /*
        * Toggle dropdown (bootstrap) on hover
        */
        dropdownFirstLevel: function() {

            this.$element.find('.dropdown .menu-item').on('mouseenter', function() {
                // console.log(this);
                $(this).dropdown('toggle');
            });

            this.$element.find('.dropdown-submenu').on({
                'mouseover': function() {
                    // console.log('ja ', this);
                    $(this).find('.dropdown-menu').show();
                },
                'mouseout': function() {
                    // console.log(this);
                    $(this).find('.dropdown-menu').hide();
                }
            });
        }


    });

    window['Header'] = Header;

    // The component registers itself to the componentHandler in the global scope.
    ComponentHandler.register({
        constructor: Header,
        classAsString: 'Header',
        cssClass: 'js-header'
    });

})(jQuery, ResponsiveBootstrapToolkit);