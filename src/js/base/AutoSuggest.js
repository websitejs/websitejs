(function($, viewport) {
    'use strict';

    /**
     * Display suggestion for inputs by calling webservice and displays response of webservice call.
     *
     * @author Rocco Janse <rocco.janse@valtech.nl>
	 * @param {jqueryelement} $element jQuery Element to autocomplete on input.
     * @param {object} [options] Optional options object to overwrite or extend default configuration.
     * @param {string} [options.apiUrl] Sets api url to use.
     * @param {string} [options.apiDataType='json'] Sets api data type.
     * @param {string} [options.apiMethod='GET'] Sets api method (GET/POST).
     * @param {boolean} [options.autoSubmit=true] Auto submit parent form if set to true and parent form is found in DOM.
     * @param {number} [options.minChars=3] Number of minimum characters before autosuggest triggers.
     * @class AutoSuggest
     */
    var AutoSuggest = function($element, options) {

        // defaults
        this.config = {
            apiUrl: '/styleguide/elements/storelocator/shimano/autosuggest.json',
            apiDataType: 'json',
            apiMethod: 'GET',
            $dropdownElement: $('<ul>'),
            autoSubmit: true,
            minChars: 3
        };

        // extend/overwrite defaults
        if (typeof options !== 'undefined') {
            this.config = $.extend(this.config, options);
        }

        // set and add dropdown element to input
        this.$element = $element;
        this.$dropdownElement = this.config.$dropdownElement.addClass('autosuggest__dropdown').hide();
        this.$dropdown = this.$dropdownElement.css({
            top: $element.offset.top,
            left: $element.offset.left,
            width: $element.outerWidth()
        }).insertAfter($element);

        return this;
    };

    $.extend(AutoSuggest.prototype, /** @lends AutoSuggest.prototype */ {

        /**
         * Disables native browsers autocomplete functionality and adds events to element
         */
        init: function() {

            // disable browsers autocomplete
            this.$element.attr('autocomplete', 'off');

            // events
            this.$element.on('keyup focus', this.handleKeyUp.bind(this));
            this.$element.on('blur', this.hideDropdown.bind(this, 200));
        },

        /**
         * handles key up events of elements.
         * @param {event} Keyup event.
         * @returns void
         */
        handleKeyUp: function(e) {

            // get value
            var _this = this,
                value = this.$element.val();

            // get autocomplete response
            if (value.length >= this.config.minChars) {
                this.getResponse(value, function(response) {
                    if (response && response.length > 0) {

                        // update dropdown with response values
                        _this.updateDropdown(value, response, function() {

                            _this.$dropdown.find('li > a').on('click', function(e) {
                                e.preventDefault();
                                _this.hideDropdown();

                                // auto submit form, if set and found
                                if (_this.config.autoSubmit === true) {
                                    var $form = _this.$element.parents('form');
                                    if ($form.length > 0) {
                                        $form.submit();
                                    }
                                }
                            });

                        });

                        // show dropdown
                        _this.showDropdown();
                    } else {
                        _this.hideDropdown();
                    }
                });
            } else if (value.length < this.config.minChars) {
                this.hideDropdown();
            }
        },

         /**
         * shows current dropdown.
         */
        showDropdown: function() {
            this.$dropdown.show();
        },

        /**
         * Updates autocompleter dropdown contents
         * and sets event handlers.
         * @param {string} value Current search query.
         * @param {array} response Current autocompleter response.
         * @param {function} [cb] Optional callback.
         * @returns void
         */
        updateDropdown: function(value, response, cb) {
            var list = [],
                regex = new RegExp(value, 'gi');

            // create list
            for (var i = 0; i < response.length; i++) {
                var match = regex.exec(response[i]);
                if (match !== null) {
                    list.push('<li><a>' + response[i].replace(regex, '<strong>' + match[0] + '</strong>') + '</a></li>');
                }
            }
            this.$dropdown.html(list.join(''));

            // callback
            if (typeof cb === 'function') {
                cb();
            }
        },

        /**
         * Hides current dropdown.
         * @param {number} d Delay to hide dropdown in ms.
         */
        hideDropdown: function(d) {
            var _this = this,
                delay = d || 0;

            setTimeout(function() {
                _this.$dropdown.hide();
            }, delay);
        },

        /**
         * Fetches autocomplete values based on search string.
         * @param {string} term Current search query.
         * @param {function} [cb] Optional callback function.
         * @returns {array} Autocompleter values in an array.
         */
        getResponse: function(term, cb) {

            var params = { term: term };

            $.ajax({
                url: this.config.apiUrl,
                data: params,
                type: this.config.apiMethod,
                dataType: this.config.apiDataType
            })
            .done(function(response) {
                if (typeof cb === 'function') {
                    if ($.isArray(response)) {
                        cb(response);
                    }
                }
            })
            .fail(function(d, textStatus, error) {
                console.error(textStatus, error);
                if (typeof cb === 'function') {
                    cb(false);
                }
            });
        }

    });

    window['AutoSuggest'] = AutoSuggest;

    // The component registers itself to the componentHandler in the global scope.
    ComponentHandler.register({
        constructor: AutoSuggest,
        classAsString: 'AutoSuggest',
        cssClass: 'js-autosuggest'
    });

})(jQuery, ResponsiveBootstrapToolkit);
