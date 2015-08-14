// A post's details view.
define(function(require) {
    'use strict';
    
    var Backbone = require('backbone'),
        detailsTpl = require('text!templates/details.html'),
        instructionsTpl = require('text!templates/instructions.html');

    return Backbone.View.extend({
       
        initialize: function(opts) {
            this.collection = opts.collection;
            this.detailsTpl = _.template(detailsTpl);
            this.instructionsTpl = _.template(instructionsTpl);

            this.listenTo(this.collection, 'selectedpostchange', this.render);
        },

        // Render the Post model if it exists, or display the instructional text.
        render: function(model) {
            var html;

            if(model) {
                this.currentModel = model;
                html = this.detailsTpl(model.toJSON());
                // If the details have not been requested yet, get them.
                if(!model.get('descriptionLoaded')) {
                    this.listenToOnce(model, 'change:description', this.updateDescription);
                    model.fetch();
                }
            } else {
                this.currentModel = null;
                html = this.instructionsTpl();
            } 

            this.$el.html(html);

            return this;
        },
        
        // Once the details are returned, add the desctiption text to the DOM.
        updateDescription: function(model) {
            if(model === this.currentModel) {
                this.$el.find('.description').html(model.get('description'));
            }
        }
    });

});
