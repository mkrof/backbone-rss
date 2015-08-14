// A representation of Post models in a list.
define(function(require) {
    'use strict';

    var Backbone = require('backbone'),
        ListItem = require('views/ListItem');

    return Backbone.View.extend({
        
        events: {
            'click ul': 'onListClicked',
            'keydown ul': 'onKeyDown'
        },
        
        initialize: function(opts) {
                
            this.collection = opts.collection;

            // Focus the list to reieve keypress events right away.
            this.$list = this.$el.find('ul').focus();

            this.listenTo(this.collection, 'reset', this.render);
            this.listenTo(this.collection, 'selectedpostchange', this.onSelectedPostChange);
            this.listenTo(Backbone, 'postroutechange', this.onPostRouteChange);

        },

        // Create a ListItem for every Post model that matches the applied filters and 
        // add append it to the ul.
        render: function(collection) {
            var items = [],
                filteredModels = collection.filter(function(model) {
                    return _.contains(collection.sources, model.get('source'));
                });
            
            _.each(collection.getFilteredPosts(), function(model) {
                
                var item = new ListItem({
                    model: model,  
                    className: model.get('selected') === true ? 'selected' : null,
                    attributes: {
                        'data-id': model.id
                    }
                });
                
                items.push(item.render().el);
            });
            
            this.$list.empty().append(items);
        },
        
        findItemById: function(id) {
            return this.$el.find('[data-id="' + id + '"]');
        },

        // When a list item is clicked, apply collection.selectPost with the 
        // list item model's id.
        onListClicked: function(e) {
            var $target = $(e.target).closest('li');
            this.collection.selectPost($target.attr('data-id'));
        },

        // When the route changes, scroll the list to bring the appropriate item
        // into view.
        onPostRouteChange: function(id) {
            var $item;

            if (id) {
                // Scroll to the item with the passed id.
                this.scrollToItem(this.findItemById(id), this.$list);
            } else {
                // There's no post in the url. Scroll to the top of the list.
                this.scrollToItem(this.$list.find('li:first-child'), this.$list);
            }
        }, 

        // Scrolls the passed li into view. Debounced to prevent 
        // the list from jumping around on repeated hash changes.
        scrollToItem: _.debounce(function($li, $ul) {
            // In the case an item is filtered we can't scroll to it.
            try {
                var anim = $li.offset().top - $ul.offset().top + $ul.scrollTop();
                $ul.animate({ scrollTop: anim });
            } catch(err) {
            
            }
        }, 200),
        

        // Sets the selected post based on up/down arrow key presses, and updates the list
        // UI to keep the selected list item in view.
        onKeyDown: function(e) {
            var code = e.keyCode,
                selected = this.collection.where({selected: true}),
                selectedEl,
                nextEl,
                nextElTopOffset,
                listTopOffset;

            // If no post is selected, return.
            if(selected.length === 0) {
                return;
            }

            selectedEl = this.findItemById(selected[0].id);

            // Up
            if(code === 38) {
                nextEl = selectedEl.prev();
            }

            // Down
            if(code === 40) {
                nextEl = selectedEl.next();
            }

            // If there is an appropriate next element, select it and update the scroll position.
            if(nextEl && nextEl.length > 0) {
                e.preventDefault();
                nextElTopOffset = nextEl.offset().top;
                listTopOffset = this.$list.offset().top;

                this.collection.selectPost(nextEl.attr('data-id'));
                
                // Scroll up.
                if(nextElTopOffset < listTopOffset) {
                    nextEl[0].scrollIntoView(true);
                }

                // Scroll down.
                if(nextElTopOffset + nextEl.height() > this.$list.height() + listTopOffset) {
                    nextEl[0].scrollIntoView(false);
                }
            }
        }

    });
});
