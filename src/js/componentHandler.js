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
        /** @ lends ComponentHandler# */
        
        /** 
         * @type {array}
         */
        this.registeredItems = [];
        
        /** 
         * @type {array} 
         */
        this.createdItems = [];

        return this;
    };

    $.extend(ComponentHandler.prototype, /** @lends ComponentHandler# */ {

        /**
         * Registers components.
         * @param {Object} item Object with component data to register.
         * @public
         */
        register: function(item) {
            
            $.each(this.registeredItems, function(i, component) {

                // check for css classname already in use
                if (component.cssClass === item.cssClass) {
                    throw new Error('The provided cssClass has already been registered: ' + component.cssClass);
                }

                // check for classname already in use
                if (component.className === item.classAsString) {
                    throw new Error('The provided classNAme has already been registered: ' + component.classAsString);
                }

            });

            var newItem = {
                classConstructor: item.constructor,
                className: item.classAsString,
                cssClass: item.cssClass,
                callbacks: []
            };

            // register component
            this.registeredItems.push(newItem);

        },

        /**
         * Finds registered item by javascript class name.
         * @param {string} jsClass JAvascript class name to find in registered items.
         * @returns {object|boolean} Found item or false.
         */
        findRegisteredItem: function(jsClass) {
            for (var i = 0; i < this.registeredItems.length; i++) {
                if (this.registeredItems[i].className === jsClass) {
                    return this.registeredItems[i];
                }
            }
            return false;
        },

        /**
         * Gets list of already upgraded classes from DOM element.
         * @param {jQueryElement} $element jQuery element to fetch data from.
         * @returns {array} Array of found upgraded classes.
         */
        getUpgradedListOfElement: function($element) {
            var upgradedData = $element.attr('data-upgraded');
            if (typeof upgradedData === 'undefined') {
                return [];
            } else {
                return upgradedData.split(',');
            }
        },

        /**
         * Returns true if given element is already upgraded by given javascript class.
         * @param {jQueryElement} $element jQuery element to check for javascript classes
         * @param {string} jsClass Javascript class to check.
         * @returns {boolean} True if element is already upgraded.
         */
        isElementUpgraded: function($element, jsClass) {
            var upgradedList = this.getUpgradedListOfElement($element);
            return upgradedList.indexOf(jsClass) !== -1;
        },

        /**
         * Get all registered items and upgrades the DOM elements.
         * @public
         */
        upgradeAllRegistered: function() {
            for (var i = 0; i < this.registeredItems.length; i++) {
                this.upgradeDOM(this.registeredItems[i].className);
            }
        },

        /**
         * Upgrades DOM elements by javascript classname and optional css class name.
         * @param {string} jsClass Javascript class name.
         * @param {string} [cssClass] Optional css class name for elements.
         * @public
         */
        upgradeDOM: function(jsClass, cssClass) {
            var className = jsClass;
            if (typeof cssClass === 'undefined') {
                var registeredItem = this.findRegisteredItem(className);
                if (registeredItem) {
                    cssClass = registeredItem.cssClass;
                }
            }
            var $elements = $('.' + cssClass);
            for (var i = 0; i < $elements.length; i++) {
                this.upgradeElement($($elements[i]), className);
            }
        },

        /**
         * Instanciate javascript class and upgrades DOM element.
         * @param {jQueryElement} $element jQuery element to upgrade.
         * @param {string} [jsClass] Otional javascript class name to upgrade to.
         * @public
         */
        upgradeElement: function($element, jsClass) {

            // get list of already upgraded classnames of element
            var upgradedList = this.getUpgradedListOfElement($element),
                classesToUpgrade = [];

            if (typeof jsClass === 'undefined') {
                
                var classList = $element[0].classList;
                $.each(this.registeredItems, function(i, item) {
                    if (classList.contains(item.cssClass) && classesToUpgrade.indexOf(item) === -1 && this.isElementUpgraded($element, item.className) === false) {
                        classesToUpgrade.push(item);
                    }
                });

            } else if (this.isElementUpgraded($element, jsClass) === false) {
                classesToUpgrade.push(this.findRegisteredItem(jsClass));
            }
            
            for (var i = 0; i < classesToUpgrade.length; i++) {
                var registeredClass = classesToUpgrade[i];
                upgradedList.push(registeredClass.className);
                $element.attr('data-upgraded', upgradedList.join(','));

                // create class instance
                var instance = new registeredClass.classConstructor($element);
                //instance['itemProperty'] = registeredClass;

                this.createdItems.push(instance);

                for (var j = 0; j < registeredClass.callbacks.length; j++) {
                    registeredClass.callbacks[j]($element);
                }  
            }

        },

        /**
         * Registers callbacks to upgrades performed on given javascript class name.
         * @param {string} jsClass Javascript class to hook into for upgrades.
         * @param {function} callback Callback function returns one parameter: jQuery element which got upgraded.
         * @public
         */
        registerUpgradedCallback: function(jsClass, callback) {
            var registeredClass = this.findRegisteredClass(jsClass);
            if (registeredClass) {
                registeredClass.callbacks.push(callback);
            }
        },

        /**
         * Fetches current registered items.
         * @returns {array} Array of currently registered items.
         * @public
         */
        getRegisteredItems: function() {
            return this.registeredItems;
        }

    });

    window['componentHandler'] = new ComponentHandler();

})(jQuery);