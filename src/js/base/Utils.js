(function($) {
    'use strict';

    /**
     * Utility functions not belonging to specific objects or classes
     *
     * @author Rocco Janse <rocco.janse@valtech.nl>
     * @class Utils
     */
    var Utils = {

        /**
         * Returns file extension from path.
         * @param {String} path Path to return extension from.
         */
        getFileExtension: function(path) {
            return path.substr(path.lastIndexOf('.')+1);
        }


    };

    window['Utils'] = Utils;

})(jQuery);
