(function($, viewport) {
    'use strict';

    /**
     * {{ucfirst_name}} functionality.
     * @class {{ucfirst_name}}
     * @param {jQueryElement} $element jQuery Element to upgrade with this class.
     * @author {{author}}
     * @date {{date}}
     */
    var {{ucfirst_name}} = function($element) {
        /** @lends {{ucfirst_name}}# */

        /**
         * @type {jQueryElement}
         */
        this.$element = $element;

        return this;
    };

    $.extend({{ucfirst_name}}.prototype, /** @lends {{ucfirst_name}}# */ {

        /**
         * Initializes component.
         * @public
         */
        init: function() {
            console.log('Inited {{ucfirst_name}}.', this);
        }

    });

    window['{{ucfirst_name}}'] = {{ucfirst_name}};

    // The component registers itself to the ComponentHandler in the global scope.
    ComponentHandler.register({
        constructor: {{ucfirst_name}},
        classAsString: '{{ucfirst_name}}',
        cssClass: 'js-{{name}}'
    });

})(jQuery, window.viewport);
