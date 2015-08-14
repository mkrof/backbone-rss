// Represents a single post
define(function(require) {
    'use strict';

    var Backbone = require('backbone');

    return Backbone.Model.extend({
        defaults: {
            description: 'loading...',
            selected: false,
            descriptionLoaded: false
        },

        // Show this message if there is no description.
        noDescriptionMessage: 'Sorry, no description is available for this post',

        url: function() {
            return '/api/posts/' + this.id + '.json';
        },
        
        parse: function(response) {
            // If there's a 'post' attribute, the response is from the details
            // endpoint, and there should be a 'description' property.
            if(response.post) {
                if(response.post.hasOwnProperty('description')) {
                    if(response.post.description.trim() === '') {
                        response.post.description = this.noDescriptionMessage;
                    }
                    this.set('descriptionLoaded', true);
                }
                return response.post;
            }
            
            // Initially, Post models are created by the Posts collection.
            // There won't be a 'description' property at that point.
            return response;
        }
    });
});
