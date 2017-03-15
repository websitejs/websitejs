/* global Utils */

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
         * Load external files asychronously, based on file extension (js/css).
         * @param {String|Array} urls Url or urls to load.
         * @param {Function} [callback] Optional callback function.
         * @memberof AsyncLoader
         * @public
         */
        this.load = function(urls, cb) {
            var _this = this,
                test = null,
                arrJS = [],
                arrCSS = [];

            if (typeof urls === 'string') {

                test = Utils.getFileExtension(urls);
                if (test === 'css') {
                    this.loadStylesheet(urls, cb);
                } else {
                    this.loadScript(urls, cb);
                }

            } else if (Array.isArray(urls)) {

                for(var i = 0; i < urls.length; i++) {

                    test = Utils.getFileExtension(urls[i]);

                    if (test === 'css') {
                        arrCSS.push(urls[i]);
                    } else {
                        arrJS.push(urls[i]);
                    }
                }

                this.loadScript(arrJS, function() {
                    _this.loadStylesheet(arrCSS, function() {
                        if (typeof cb === 'function') {
                            cb();
                        }
                    });
                });
            }
        };

        /**
         * Loads a script, or an array of scripts asychronously and dependend.
         * @param {String|Array} paramUrl Url or urls to load.
         * @param {Function} [callback] Optional callback function.
         * @memberof AsyncLoader
         * @public
         */
        this.loadScript = function(paramUrl, callback) {
            var _this = this;
            if (typeof paramUrl === 'string') {
                this.createElement('script', 'type', 'text/javascript', 'src', paramUrl, callback);
            } else if (Array.isArray(paramUrl) && paramUrl.length > 0) {
                var current = 0;
                // recursively load scripts untill all scripts are loaded
                var recursiveCreateElement = function(url) {
                    _this.createElement('script', 'type', 'text/javascript', 'src', url, function() {
                        current++;
                        if (current <= paramUrl.length - 1) {
                            recursiveCreateElement(paramUrl[current]);
                        } else {
                            callback();
                        }
                    });
                };
                recursiveCreateElement(paramUrl[current]);
            } else {
                if (typeof callback === 'function') {
                    callback();
                }
            }
        };

        /**
         * Loads a stylesheet, or an array of stylesheets asychronously and dependend.
         * @param {String} paramUrl Url or urls to load.
         * @param {Function} [callback] Optional callback function.
         * @memberof AsyncLoader
         * @public
         */
        this.loadStylesheet = function(paramUrl, callback) {
            var _this = this;
            if (typeof paramUrl === 'string') {
                this.createElement('link', 'rel', 'stylesheet', 'href', paramUrl, callback);
            } else if (Array.isArray(paramUrl) && paramUrl.length > 0) {
                var current = 0;
                // recursively load scripts untill all scripts are loaded
                var recursiveCreateElement = function(url) {
                    _this.createElement('link', 'rel', 'stylesheet', 'href', url, function() {
                        current++;
                        if (current <= paramUrl.length - 1) {
                            recursiveCreateElement(paramUrl[current]);
                        } else {
                            callback();
                        }
                    });
                };
                recursiveCreateElement(paramUrl[current]);
            } else {
                if (typeof callback === 'function') {
                    callback();
                }
            }
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
