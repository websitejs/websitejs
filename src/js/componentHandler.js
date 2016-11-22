(function($) {
    'use strict';

    /**
     * Keeps track of registered elements and components.
     * Upgrades components when classnames are found in the DOM.
     * 
     * @author Rocco Janse <rocco.janse@valtech.nl>
     * @class ComponentHandler
     */
    var ComponentHandler = function() {

        var _this = this;
        
        /** 
         * @type {array} 
         * @private 
         */
        var registeredItems = [];

        /**
         * Registers components.
         * @param {Object} el Object with component data to register.
         * @public
         */
        this.register = function(el) {
            
            $.each(registeredItems, function(i, component) {

                // check for css classname already in use
                if (component.cssClass === el.cssClass) {
                    throw new Error('The provided cssClass has already been registered: ' + component.cssClass);
                }

                // check for classname already in use
                if (component.className === el.classAsString) {
                    throw new Error('The provided classNAme has already been registered: ' + component.classAsString);
                }

            });

            var item = {
                classConstructor: el.constructor,
                className: el.classAsString,
                cssClass: el.cssClass
            };

            // register component
            registeredItems.push(item);

        };

        this.upgradeAllRegistered = function() {
            for (var i = 0; i < registeredItems.length; i++) {
                this.upgradeDOM(registeredItems.className);
            }
        };

        this.upgradeDOM = function(jsClass, cssClass) {
            var className = jsClass;
            if (typeof cssClass === 'undefined') {
                var registeredItem = this.findRegisteredItem(className);
                if (registeredItem) {
                    cssClass = registeredItem.cssClass;
                }
            }
            var $elements = $('.' + cssClass);
            for (var i = 0; i < $elements.length; i++) {
                this.upgradeElement($elements[i], className);
            }
        };

        this.upgradeElement = function($element, jsClass) {
            // get class
            // upgrade element with instance of class
        };

        /**
         * Fetches current registered items.
         * @returns {array} Array of currently registered items.
         * @public
         */
        this.getRegisteredItems = function() {
            return registeredItems;
        }

    };

    window['componentHandler'] = new ComponentHandler();

})(jQuery);