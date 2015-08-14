// Handles URL routing for the app.
define(function(require) {
    'use strict';

    var Backbone = require('backbone');

    return Backbone.Router.extend({
        
        initialize: function(opts) {
            this.collection = opts.collection;

            this.listenTo(this.collection, 'selectedpostchange', this.onSelectedPostChange);
        },

        routes: {
            '':         'home',
            '/':        'home',
            'post/:id': 'showPost'
        },
        
        home: function(id) {
            this.collection.selectPost(null);
            Backbone.trigger('postroutechange', id);
        },

        showPost: function(id) {
            this.collection.selectPost(id);
            Backbone.trigger('postroutechange', id);
        },
        
        // Update the URL whenever the selected post changes.
        onSelectedPostChange: function(model) {
            if(model && model.get('selected') === true) {
                this.navigate('post/' + model.get('id'));
            } else {
                this.navigate('/');
            }
        }

    });
});
