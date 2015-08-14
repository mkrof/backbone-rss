require.config({
    paths: {
        text:           'vendor/text',
        backbone:       'vendor/backbone',
        jquery:         'vendor/jquery',
        underscore:     'vendor/underscore',
        router:         './router',
        models:         './models',
        collections:    './collections',
        views:          './views',
        templates:      '../templates'
    },

    shim: {
        backbone: {
            deps:       ['underscore', 'jquery'],
            exports:    'Backbone'
        },
        underscore: {
            exports: '_'
        }
    }
});

define('modernizr', function() {
    return window.Modernizr;
});

// Initailize the app.
require(['jquery', 'app'], function($, App) {
    $(function() {
        App.init();
    });
});
