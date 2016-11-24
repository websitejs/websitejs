$(document).ready(function() {
    'use strict';

    if (typeof window.viewport === 'undefined') { 
        window.viewport = ResponsiveBootstrapToolkit; 
    }

    // upgrade DOM with registerd elements/components
    ComponentHandler.upgradeAllRegistered();

    console.log('ready.');
});