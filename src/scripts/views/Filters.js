// A view that creates a checkbox for every source in the Posts collection, 
// allowing users to filter items.
define(function(require) {
    'use strict';

    var Backbone = require('backbone'),
        filtersTpl = require('text!templates/filters.html');

    return Backbone.View.extend({
        events: {
            'click form': 'onFormClick'
        },

        initialize: function() {
            
            this.$form = this.$el.find('form');
            this.filtersTpl = _.template(filtersTpl);
            
            this.listenToOnce(this.collection, 'reset', this.onCollectionReset);
        },

        onCollectionReset: function(collection) {
            // Make sure the model has all the sources that exist in the collection.
            var sources = _.chain(collection.models)
                .map(function(model) {
                    return model.get('source');
                })
                .uniq()
                .value();

            _.each(sources, function(source) {
                if(!this.model.has(source)) {
                    this.model.set(source, true);
                }
            }, this);

            this.render();
        },

        // Build a checkbox for each of collection.sources.
        render: function(collection) {
            var html = '',
                filterData = _.map(this.model.toJSON(), function(val, key) {
                    return {
                        name: key,
                        active: val ? 'checked=true' : ''
                    };
                });

            _.each(filterData, function(filterDatum) {
                html += this.filtersTpl(filterDatum);
            }, this);

            this.$form.html(html);
        },

        // Update the filters model.
        onFormClick: function(e) {
            var t = e.target;
            if($(t).is(':checkbox')) {
                this.model.set(t.value, t.checked);
            }
        }
    });
});
