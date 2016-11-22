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
         * @type {array} 
         * @private 
         */
        var createdItems = [];

        /**
         * Registers components.
         * @param {Object} item Object with component data to register.
         * @memberof ComponentHandler
         * @public
         */
        this.register = function(item) {
            
            $.each(registeredItems, function(i, component) {

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
            registeredItems.push(newItem);

        };

        /**
         * Finds registered item by javascript class name.
         * @param {string} jsClass JAvascript class name to find in registered items.
         * @memberof ComponentHandler
         * @returns {object|boolean} Found item or false.
         */
        this.findRegisteredItem = function(jsClass) {
            for (var i = 0; i < registeredItems.length; i++) {
                if (registeredItems[i].className === jsClass) {
                    return registeredItems[i];
                }
            }
            return false;
        };

        /**
         * Gets list of already upgraded classes from DOM element.
         * @param {jQueryElement} $element jQuery element to fetch data from.
         * @memberof ComponentHandler
         * @returns {array} Array of found upgraded classes.
         */
        this.getUpgradedListOfElement = function($element) {
            var upgradedData = $element.attr('data-upgraded');
            if (typeof upgradedData === 'undefined') {
                return [];
            } else {
                return upgradedData.split(',');
            }
        };

        /**
         * Returns true if given element is already upgraded by given javascript class.
         * @param {jQueryElement} $element jQuery element to check for javascript classes
         * @param {string} jsClass Javascript class to check.
         * @memberof ComponentHandler
         * @returns {boolean} True if element is already upgraded.
         */
        this.isElementUpgraded = function($element, jsClass) {
            var upgradedList = this.getUpgradedListOfElement($element);
            return upgradedList.indexOf(jsClass) !== -1;
        };

        /**
         * Get all registered items and upgrades the DOM elements.
         * @memberof ComponentHandler
         * @public
         */
        this.upgradeAllRegistered = function() {
            for (var i = 0; i < registeredItems.length; i++) {
                this.upgradeDOM(registeredItems[i].className);
            }
        };

        /**
         * Upgrades DOM elements by javascript classname and optional css class name.
         * @param {string} jsClass Javascript class name.
         * @param {string} [cssClass] Optional css class name for elements.
         * @memberof ComponentHandler
         * @public
         */
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
                this.upgradeElement($($elements[i]), className);
            }
        };

        /**
         * Instanciate javascript class and upgrades DOM element.
         * @param {jQueryElement} $element jQuery element to upgrade.
         * @param {string} [jsClass] Otional javascript class name to upgrade to.
         * @memberof ComponentHandler
         * @public
         */
        this.upgradeElement = function($element, jsClass) {

            // get list of already upgraded classnames of element
            var upgradedList = this.getUpgradedListOfElement($element),
                classesToUpgrade = [];

            if (typeof jsClass === 'undefined') {
                
                var classList = $element[0].classList;
                $.each(registeredItems, function(i, item) {
                    if (classList.contains(item.cssClass) && classesToUpgrade.indexOf(item) === -1 && _this.isElementUpgraded($element, item.className) === false) {
                        classesToUpgrade.push(item);
                    }
                });

            } else if (_this.isElementUpgraded($element, jsClass) === false) {
                classesToUpgrade.push(this.findRegisteredItem(jsClass));
            }
            
            for (var i = 0; i < classesToUpgrade.length; i++) {
                var registeredClass = classesToUpgrade[i];
                upgradedList.push(registeredClass.className);
                $element.attr('data-upgraded', upgradedList.join(','));

                // create class instance
                var instance = new registeredClass.classConstructor($element);
                //instance['itemProperty'] = registeredClass;

                createdItems.push(instance);

                for (var j = 0; j < registeredClass.callbacks.length; j++) {
                    registeredClass.callbacks[j]($element);
                }  
            }

        };

        /**
         * Registers callbacks to upgrades performed on given javascript class name.
         * @param {string} jsClass Javascript class to hook into for upgrades.
         * @param {function} callback Callback function returns one parameter: jQuery element which got upgraded.
         * @memberof ComponentHandler
         * @public
         */
        this.registerUpgradedCallback = function(jsClass, callback) {
            var registeredClass = this.findRegisteredClass(jsClass);
            if (registeredClass) {
                registeredClass.callbacks.push(callback);
            }
        };

        /**
         * Fetches current registered items.
         * @returns {array} Array of currently registered items.
         * @memberof ComponentHandler
         * @public
         */
        this.getRegisteredItems = function() {
            return registeredItems;
        };

    };

    window['componentHandler'] = new ComponentHandler();

})(jQuery);