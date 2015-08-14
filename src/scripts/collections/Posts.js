// A collection of post models.
define(function(require) {
    'use strict';

    var Backbone = require('backbone'),
        Post = require('models/Post');

    return Backbone.Collection.extend({

        model: Post,

        initialize: function(items, opts) {
            this.filtersModel = opts.filtersModel;
            this.listenTo(this.filtersModel, 'change', this.onFilterChange);
        },

        parse: function(response) {
            // Return the posts array.
            return response.posts;
        },
        
        
        // Sets the 'selected' property of the model with the passed id to true.
        // Deselects the previously selected model, and dispatches the 
        // selectedpostchange event.
        selectPost: function(id) {
            var selected = this.where({selected: true}),
                model = this.get(id);

            if(selected.length > 0) {
                //If the current model is already selected, return.
                if(model === selected[0]) {
                    return;
                }
                selected[0].set('selected', false);
            }
            
            // model could be undefined.
            if(model) {
                model.set('selected', true);
            }

            this.trigger('selectedpostchange', model);
        },
        
        onFilterChange: function(m) {
            this.trigger('reset', this);
        },
        
        // Returns the models with sources that are 'true' on the filtersModel.
        getFilteredPosts: function() {
            return this.filter(function(model) {
                return this.filtersModel.get(model.get('source'));
            }, this);
        }

    });
});
