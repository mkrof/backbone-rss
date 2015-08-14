define(function(require) {
    'use strict';

    var $ = require('jquery'),
        Backbone = require('backbone'),
        Posts = require('collections/Posts'),
        List = require('views/List'),
        Details = require('views/Details'),
        FiltersModel = require('models/Filters'),
        Filters = require('views/Filters'),
        Router = require('router');

    return {
        init: function() {
            // Use moustache-style syntax in underscore templates.
            _.templateSettings.interpolate = /\{\{(.+?)\}\}/g;

            // Initialize application objects.
            var filtersModel = new FiltersModel(),
                posts = new Posts([], {
                    url: '/api/posts.json',
                    filtersModel: filtersModel
                }),
                router = new Router({
                    collection: posts
                }),
                list = new List({
                    el: '#list',
                    collection: posts
                }),
                details = new Details({
                    el: '#details',
                    collection: posts
                }),
                filters = new Filters({
                    el: '#filters',
                    collection: posts,
                    model: filtersModel
                });

            // Get the posts data. 
            $.when(posts.fetch({reset: true})).done(function() {
                // The history needs to be started after the posts are returned.
                Backbone.history.start();
            });
        }
    };
});
