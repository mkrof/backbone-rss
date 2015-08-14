// Model representing the current filters (by source) for the post collection.
define(function(require) {
    'use strict';

    var Backbone = require('backbone'),
        Modernizr = require('modernizr');
    
    return Backbone.Model.extend({
        
        // Check localstorage for defaults.
        defaults: function() {
            try {
                return JSON.parse(window.localStorage.sourceFilters);
            } catch(err) {
                return {};
            }
        },

        initialize: function() {
            if(Modernizr.localstorage) {
                var self = this;
                // Apply Model.set, but also save to localstorage.
                this.set = function(key, val) {
                    Backbone.Model.prototype.set.apply(this, arguments);
                    window.localStorage.setItem('sourceFilters', JSON.stringify(self.toJSON()));
                };
            }
        }
    });
});

