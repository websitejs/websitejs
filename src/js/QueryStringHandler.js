(function($) {
    'use strict';

    /**
     * Handles querystring operations
     * 
     * @author Rocco Janse <rocco.janse@valtech.nl>
     * @class QueryStringHandler
     */
    var QueryStringHandler = function() {

        this.getParams = function() {

            this.getQueryString();

        };
        
        // /**
        //  * Loads a script asychronously.
        //  * @param {String} url Url to load.
        //  * @param {Function} [callback] Optional callback function.
        //  * @memberof AsyncLoader
        //  * @public
        //  */
        // this.loadScript = function(url, callback) {
        //     this.createElement('script', 'type', 'text/javascript', 'src', url, callback);
        // };

        return this;
    };

    $.extend(QueryStringHandler.prototype, /** @lends QueryStringHandler.prototype */ {

        getQueryString: function() {
            var loc = window.location;
            console.log(loc);
        }

    });

    window['QueryStringHandler'] = new QueryStringHandler();

})(jQuery);