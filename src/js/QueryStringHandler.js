(function($) {
    'use strict';

    /**
     * Handles querystring operations
     * 
     * @author Rocco Janse <rocco.janse@valtech.nl>
     * @class QueryStringHandler
     */
    var QueryStringHandler = function() {

        /**
         * Updates current url without pagerefresh. Pushes current url to history,
         * so going back to previous url/state (ie. by browser's back button) is supported.
         * @param {String} params Querystring parameters to update url with.
         * @param {String} [hash] Optional hash to append to url.
         * @memberof QueryStringHandler
         * @public
         */
        this.updateUrl = function(params, hash) {
            var url = window.location.origin + window.location.pathname;
            if (params.length > 0) {
                url += '?' + params;
            }
            if (typeof hash !== 'undefined' && hash.length > 0) {
                url += '#' + hash;
            } else {
                url += window.location.hash;
            }
            
            var stateObj = { url: url };
            history.pushState(stateObj, '', url);
        };

        return this;
    };

    $.extend(QueryStringHandler.prototype, /** @lends QueryStringHandler.prototype */ {

        /**
         * Combines two querystrings. Ie. new querystring and current querystring.
         * Updates and adds parameters.
         * @param {Object|String} newParams New object with parameters as properties or new querystring string.
         * @param {Object|String} [oldParams] Optional other objects or quersystring string. If omitted current querystring is used.
         * @returns {String} New querystring.
         * @public
         */
        updateParams: function(newParams, oldParams) {
            var oParams; 
            if (typeof oldParams !== 'undefined') {
                if (typeof oldParams === 'object') {
                    oParams = oldParams;
                } else {
                    oParams = this.getParams(oldParams);
                }
            } else {
                oParams = this.getParams();
            }
            var nParams = (typeof newParams === 'object') ? newParams : this.getParams(newParams);
            var currentParams = $.extend(true, {}, oParams, nParams);
            return this.flattenParams(currentParams);
        },

        /**
         * Creates a querystring based on object properties and their corresponding values.
         * @param {Object} paramsObj Object with parameters to be converted to querystring string.
         * @returns {String} Querystring parameters and values.
         * @public
         */
        flattenParams: function(paramsObj) {
            var qsArray = [];
            for (var param in paramsObj) {
                var value;
                if (paramsObj[param].length > 0) {
                    if (Array.isArray(paramsObj[param])) {
                        value = paramsObj[param].join(',');
                    } else {
                        value = paramsObj[param];
                    }
                    qsArray.push(param + '=' + value);
                }
            }
            return qsArray.join('&');
        },

        /**
         * Fetches given querystring or current querystring params and corresponding values.
         * @param {String} [queryString] Optional querystring to fetch parameters from.
         * @returns {Object} Querystring parameters and values.
         * @public
         */
        getParams: function(queryString) {

            var paramsObj = {},
                qs = (typeof queryString !== 'undefined') ? queryString.replace(/\?/g,'') : this.getQueryString(true),
                pairs = qs.split('&');

            $.each(pairs, function(i, pair) {
                var param, values;
                if (pair.indexOf('=') !== -1) {
                    var paramValues = pair.split('=');
                    param = paramValues[0];
                    values = paramValues[1].split(',');
                } else {
                    param = pair;
                    values = [];
                }
                if (values.length > 1) {
                    paramsObj[param] = values;
                } else if (values.length === 1) {
                    paramsObj[param] = values[0];
                } else {
                    paramsObj[param] = '';
                }   
            });

            return paramsObj;
        },

        /**
         * Fetches current querystring of window.location.
         * @param {Boolean} [stripQuestionMark] If true strips '?' from beginning of querystring.
         * @returns {String} Querystring.
         * @public
         */
        getQueryString: function(stripQuestionMark) {
            if (typeof stripQuestionMark !== 'undefined' && stripQuestionMark === true) {
                return window.location.search.replace(/\?/g,'');
            }
            return window.location.search;
        },

        /**
         * Fetches current hash of window.location.
         * @param {Boolean} [stripHashtag] If true strips '#' from beginning of hash.
         * @returns {String} Hash.
         * @public
         */
        getHash: function(stripHashtag) {
            if (typeof stripHashtag !== 'undefined' && stripHashtag === true) {
                return window.location.hash.replace(/\#/g,'');
            }
            return window.location.hash;
        }

    });

    window['QueryStringHandler'] = new QueryStringHandler();

})(jQuery);