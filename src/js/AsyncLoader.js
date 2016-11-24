(function($) {
    'use strict';

    /**
     * Loads scripts asynchrone
     * 
     * @author Rocco Janse <rocco.janse@valtech.nl>
     * @class AsyncLoader
     */
    var AsyncLoader = function() {

        this.createdElements = [];
        
        /**
         * Loads a script asychronously.
         * @param {String} url Url to load.
         * @param {Function} [callback] Optional callback function.
         * @memberof AsyncLoader
         * @public
         */
        this.loadScript = function(url, callback) {
            this.createElement('script', 'type', 'text/javascript', 'src', url, callback);
        };

        /**
         * Loads a stylesheet asychronously.
         * @param {String} url Url to load.
         * @param {Function} [callback] Optional callback function.
         * @memberof AsyncLoader
         * @public
         */
        this.loadStylesheet = function(url, callback) {
            this.createElement('link', 'rel', 'stylesheet', 'href', url, callback);
        };


        return this;
    };

    $.extend(AsyncLoader.prototype, /** @lends AsyncLoader.prototype */ {

        /**
         * Creates an element to load file.
         * @param {String} elementType Type of element container.
         * @param {String} fileTypeAttr Attribute for element to set type of file.
         * @param {String} fileType Type of file to load.
         * @param {String} fileUrlAttr Attribute for element used to load url.
         * @param {String} fileUrl Url of file to load.
         * @param {Function} [callback] Optional callback function.
         * @public
         */
        createElement: function(elementType, fileTypeAttr, fileType, fileUrlAttr, fileUrl, callback) {

            var _this = this,
                element = this.findElement(elementType, fileUrlAttr, fileUrl);

                console.log(element);

            // if element does not already exist, create new element
            if (!element) {
                element = document.createElement(elementType);
                element[fileTypeAttr] = fileType;
                document.body.appendChild(element);
                
                if (typeof callback === 'function') {
                    element.addEventListener('load', function() {
                        _this.createdElements.push(fileUrl);
                        callback();
                    });  
                }

                element[fileUrlAttr] = fileUrl;

            } else {

                console.log(this.createdElements.indexOf(fileUrl));

                // element exists, but is file loaded?
                if (this.createdElements.indexOf(fileUrl) === -1) {
                    if (typeof callback === 'function') {
                        element[0].addEventListener('load', function() {
                            _this.createdElements.push(fileUrl);
                            callback();
                        });  
                    }                  
                } else {
                    if (typeof callback === 'function') {
                        callback();
                    }                     
                }
            }
        },

        /**
         * Finds an element that already exists.
         * @param {String} elementType Type of element container.
         * @param {String} fileUrlAttr Attribute for element used to load url.
         * @param {String} fileUrl Url of file to load.
         * @returns {jQueryElement|Boolean} jQuery Element when element already exists.
         * @public
         */
        findElement: function(elementType, fileUrlAttr, fileUrl) {
            var elements = $(elementType);
            for (var i = 0; i < elements.length; i++) {
                if ($(elements[i]).attr(fileUrlAttr) === fileUrl) {
                    return $(elements[i]);
                }
            }
            return false;
        }

    });

    window['AsyncLoader'] = new AsyncLoader();

})(jQuery);