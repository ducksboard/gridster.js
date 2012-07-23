/*
 * jquery.draggable
 * https://github.com/ducksboard/gridster.js
 *
 * Copyright (c) 2012 ducksboard
 * Licensed under the MIT, GPL licenses.
 */

;(function($, window, document, undefined){

    var defaults = {
        items: '.gs_w',
        distance: 1,
        limit: true,
        offset_left: 0
        // ,drag: function(e){},
        // start : function(e, ui){},
        // stop : function(e){}
    };

    var $body = $(document.body);


    /**
    * @class Draggable
    *
    * @param {HTMLElement} el The HTMLelement that contains all the widgets
    *  to be dragged.
    * @param {Object} [options] An Object with all options you want to
    *        overwrite:
    *    @param {HTMLElement|String} [options.items] Define who will
    *     be the draggable items. Can be a CSS Selector String or a
    *     collection of HTMLElements.
    *    @param {Number} [options.distance] Distance in pixels after mousedown
    *     the mouse must move before dragging should start.
    *    @param {Boolean} [options.limit] Constrains dragging to the width of
    *     the container
    *    @param {offset_left} [options.offset_left] Offset added to the item
    *     that is being dragged.
    *    @param {Number} [options.drag] Executes a callback when the mouse is
    *     moved during the dragging.
    *    @param {Number} [options.start] Executes a callback when the drag
    *     starts.
    *    @param {Number} [options.stop] Executes a callback when the drag stops.
    * @return {Object} Returns `el`.
    * @constructor
    */
    function Draggable(el, options) {
      this.options = $.extend({}, defaults, options);
      this.$container = $(el);
      this.$dragitems = $(this.options.items, this.$container);
      this.is_dragging = false;
      this.player_min_left = 0 + this.options.offset_left;

      this.init();
    };

    var fn = Draggable.prototype;

    fn.init = function() {
        this.$container.css('position', 'relative');
        this.enable();
    };


    fn.get_actual_pos = function($el) {
        var pos = $el.position();
        return pos;
    };


    fn.get_mouse_pos = function(e) {
        return {
            left: e.clientX,
            top: e.clientY
        };
    };


    fn.drag_handler = function(e) {
        if (e.which !== 1) {
            return false;
        };

        var self = this;
        var first = true;
        this.$player = $(e.currentTarget);

        this.el_init_pos = this.get_actual_pos(this.$player);
        this.mouse_init_pos = this.get_mouse_pos(e);

        $body.on('mousemove.draggable', function(mme){

            var mouse_actual_pos = self.get_mouse_pos(mme);
            var diff_x = Math.abs(mouse_actual_pos.left - self.mouse_init_pos.left);
            var diff_y = Math.abs(mouse_actual_pos.top - self.mouse_init_pos.top);
            if (!(diff_x > self.options.distance || diff_y > self.options.distance)) {
                return false;
            }

            if (first) {
                first = false;
                self.on_dragstart.call(self, mme);
                return false;
            }

            if (self.is_dragging == true) {
                throttle(self.on_dragmove.call(self, mme), 130);
            };

            return false;

        });

        return false;
    };


    fn.on_dragstart = function(e) {
        e.preventDefault();
        this.drag_start = true;
        this.is_dragging = true;
        this.$container_offset = this.$container.offset();
        if (this.options.helper === 'clone') {
            this.$helper = this.$player.clone().appendTo(this.$container).addClass('helper');
            this.helper = true;
        }else{
            this.helper = false;
        }
        this.el_init_offset = this.$player.offset();
        this.player_width = this.$player.width();
        this.player_max_left = this.$container.width() - this.player_width + this.options.offset_left;
        if (this.options.start) {
            this.options.start.call(this.$player, e, {
                helper: this.helper ? this.$helper : this.$player
            });
        };
        return false;
    };


    fn.get_offset = function(e) {
        e.preventDefault();
        var mouse_actual_pos = this.get_mouse_pos(e);
        var diff_x = mouse_actual_pos.left - this.mouse_init_pos.left;
        var diff_y = mouse_actual_pos.top - this.mouse_init_pos.top;

        var left = this.el_init_offset.left + diff_x - this.$container_offset.left;
        var top = this.el_init_offset.top + diff_y - this.$container_offset.top;

        if (this.options.limit) {
            if (left > this.player_max_left) {
                left = this.player_max_left;
            }else if(left < this.player_min_left) {
                left = this.player_min_left;
            }
        };

        return {
            left: left,
            top: top
        }
    };


    fn.on_dragmove = function(e) {
        var offset = this.get_offset(e);

        (this.helper ? this.$helper : this.$player).css({
            'position': 'absolute',
            'left' : offset.left,
            'top' : offset.top
        });

        var ui = {
            'position': {
                'left': offset.left,
                'top': offset.top
            }
        };

        if (this.options.drag) {
            this.options.drag.call(this.$player, e, ui);
        }
        return false;
    };


    fn.on_dragstop = function(e) {
        var offset = this.get_offset(e);

        this.drag_start = false;

        var ui = {
            'position': {
                'left': offset.left,
                'top': offset.top
            }
        }

        if (this.options.stop) {
            this.options.stop.call(this.$player, e, ui);
        }

        if (this.helper) {
            this.$helper.remove();
        }

        return false;
    };


    fn.enable = function(){
        this.$container.on('mousedown.draggable', this.options.items, $.proxy(this.drag_handler, this));
        $body.on('mouseup.draggable', $.proxy(function(e) {
            this.is_dragging = false;
            $body.off('mousemove.draggable');
            if (this.drag_start) {
                this.on_dragstop(e);
            }
        }, this));
    };


    fn.disable = function(){
        this.$container.off('mousedown.draggable');
        $body.off('mouseup.draggable');
    };


    fn.destroy = function(){
        this.disable();
        $.removeData(this.$container, 'draggable');
    };


    //jQuery adapter
    $.fn.draggable = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'draggable')) {
                $.data(this, 'draggable', new Draggable( this, options ));
            }
        });
    };


}(jQuery, window, document));
