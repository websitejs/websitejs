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
            this.dropdownReplaceLang();
            this.mobileMenuDropdown();

        }, 

        /**
         * calculate buttons width total,
         * to determine if the standard menu or menu with more button should be shown.
         */
        calculateButtonWidth: function() { 
            var buttonWidth = 0;

            $('.navbar__standard-menu .menu-item').each(function(index, value) {
                buttonWidth += parseInt($(this).outerWidth());
            });
            console.log(viewport.current());

            if(viewport.is('>xs')) {
                console.log('groot');
                if(buttonWidth > $('.navbar__standard-menu').width() || viewport.is('<sm')) {
                    console.log('ja hallo');
                    $('.navbar__standard-menu').addClass('hidden');
                    
                    $('.navbar__more-menu').addClass('show');
                    $('.navbar__more-menu').removeClass('hidden');
                } else {
                    $('.navbar__more-menu').removeClass('show');
                    $('.navbar__more-menu').addClass('hidden');

                    $('.navbar__standard-menu').removeClass('hidden');
                    console.log('poep');
                    $('.navbar__standard-menu').removeClass('navbar__standard-menu--opacity');
                }
            } else { // current website: breakpoint mobile menu is at 600px wide, bootstrap uses 768px.
                $('.navbar__more-menu').removeClass('show');
                $('.navbar__more-menu').addClass('hidden');

                $('.navbar__standard-menu').removeClass('navbar__standard-menu--opacity');
            }
        },

        /**
         * Toggle dropdown (bootstrap) on hover
         */
        dropdownFirstLevel: function() {

            if(viewport.is('>xs')) {
                this.$element.find('.dropdown .menu-item').on('mouseenter', function() {
                    $(this).dropdown('toggle');
                });

                this.$element.find('.dropdown-submenu').on({
                    'mouseover': function() {
                        $(this).find('.dropdown-menu').show();
                    },
                    'mouseout': function() {
                        $(this).find('.dropdown-menu').hide();
                    }
                });
            }      
        },

        /** 
         * Language dropdown replace language text
         */ 
        dropdownReplaceLang: function(){

            $('.header-logobar .dropdown-menu li a').on("click", function(){
                $('.lang-dropdown').html($(this).html());
            });
        },

        mobileMenuDropdown: function() {
             $('.menu-item--first-level').on('click', function(event) {
                event.preventDefault(); 
                event.stopPropagation(); 
                $(this).parent().siblings().removeClass('open');
                $(this).parent().toggleClass('open');
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