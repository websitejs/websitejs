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
            // this.calculateWhichButtons();
        }, 

        calculateButtonWidth: function() {
            // loop through all li's in certain class, 
            // check if width is more then max container width of page - take predefined widths of the styleguide
            // if it's less, show first part js-all-buttons
            // if it's more, show second part js-more-button
            // check http://stackoverflow.com/questions/3808808/how-to-get-element-by-class-in-javascript

            // var buttonArray = document.getElementById('js-all-buttons').getElementsByTagName('li');
            // var buttonWidth = 0;
            // // console.log(buttonLiArray);
            // for(var i = 0; i < buttonLiArray.length; i++) {
            //     buttonWidth += parseInt(buttonLiArray[i].clientWidth);
            //     // console.log(buttonWidth);
            //     if(i === (buttonLiArray.length - 1)) {
            //         // console.log(buttonWidth);
            //         // return buttonWidth;
            //         console.log(viewport);
            //         if(buttonWidth > viewport.is('sm')) {  
            //             console.log('shoot');
            //             document.getElementById('js-more-button').style.display = "table-cell";
            //             document.getElementById('js-all-buttons').style.display = "none";
            //         } else {
            //             document.getElementById('js-all-buttons').style.opacity = "1";
            //         }
            //     }
            // }

            //jQuery
            var buttonWidth = 0;
            $(".header-button").each(function(index, value) {
                console.log($(".header-button"));
                console.log($(this).width());
                buttonWidth += parseInt($(this).width());
                console.log(buttonWidth,' breeeeeed');
                // if the width of all buttons are calculated
                // check first if the viewport is more then mobile (more then sm)
                // if so, check if buttonWidth is more then the current total width of ul.
                if(buttonWidth > $('.navbar__standard-menu').width() || viewport.is('<sm')) {
                    console.log('successss');
                    $('.navbar__standard-menu').css('display', 'none');
                    $('.navbar__more-menu').css('display', 'block');
                } else {
                    $('.navbar__standard-menu').css('opacity', '1');
                }
            });

        }

        // calculateWhichButtons: function() {}

    });

    window['Header'] = Header;

    // The component registers itself to the componentHandler in the global scope.
    ComponentHandler.register({
        constructor: Header,
        classAsString: 'Header',
        cssClass: 'js-header'
    });

})(jQuery, ResponsiveBootstrapToolkit);