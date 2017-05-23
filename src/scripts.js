$(document).ready(function() {
    'use strict';

    // init global vieport var
    if (typeof window.viewport === 'undefined') {
        window.viewport = ResponsiveBootstrapToolkit;
    }

    // upgrade DOM with registerd elements/components
    ComponentHandler.upgradeAllRegistered();

    // add custom inits etc here

    console.log('ready.');
});
