// An individaul Post in the list.
define(function(require) {
    'use strict';
    
    var Backbone = require('backbone'),
        listItemTpl = require('text!templates/listItem.html');

    return Backbone.View.extend({
        
        tagName: 'li',
        
        initialize: function(opts) {
            this.listItemTpl = _.template(listItemTpl);

            this.listenTo(this.model, 'change:selected', this.onSelectedChange);
        },
        
        // Add the 'selected' class to this element when the model is selected.
        onSelectedChange: function(model) {
            var isSelected = model.get('selected');
            this.$el.toggleClass('selected', isSelected);
        },

        render: function() {
            this.$el.html(
                this.listItemTpl(this.model.toJSON())
            );

            return this;
        }

    });
});
