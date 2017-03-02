/* globals mdc */

/**
 * Implements the Material Design Ripple on buttons or surfaces
 * @see https://github.com/material-components/material-components-web
 * @see https://github.com/material-components/material-components-web/tree/master/packages/mdc-ripple#the-mdc-ripple-surface-class
 */
(function($, viewport) {
    'use strict';

    var MDCRipple = mdc.ripple.MDCRipple,
        MDCRippleFoundation = mdc.ripple.MDCRippleFoundation;

    var ripples = $('.btn--ripple');
    $.each(ripples, function(i, ripple) {
        MDCRipple.attachTo(ripple);
    });

})(jQuery, window.viewport);
