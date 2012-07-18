/*
 * jquery.collision
 * https://github.com/ducksboard/gridster.js
 *
 * Copyright (c) 2012 ducksboard
 * Licensed under the MIT, GPL licenses.
 */

;(function($, window, document, undefined){

    var defaults = {
      colliders_context: document.body,
      on_overlap: function(collider_data){},
      on_overlap_start : function(collider_data){
          // console.log('the element START being a collider', collider_data);
      },
      on_overlap_stop : function(collider_data){
          // console.log('the element STOP being a collider', collider_data);
      }
    };

    /**
    * Collision
    *
    * @class Collision
    * @uses Coords
    * @param {HTMLElement} element An Attribute name or object property path
    * @param {String|HTMLElement|Array} colliders An Attribute name or object property path
    * @param {Object} [options] An Attribute name or object property path
    *   @param {Function} [options.on_overlap] An Attribute name or object property path
    *   @param {Function} [options.on_overlap_start] An Attribute name or object property path
    *   @param {Function} [options.on_overlap_stop] An Attribute name or object property path
    * @return {Object} dasdasdadasd
    * @constructor
    */
    function Collision(element, colliders, options) {
      this.options = $.extend(defaults, options);
      this.$element = element;
      this.last_colliders = [];
      this.last_colliders_coords = [];
      if (typeof colliders === 'string' || colliders instanceof jQuery) {
          this.$colliders = $(colliders,
               this.options.colliders_context).not(this.$element);
      }else{
          this.colliders = $(colliders);
      }

      this.init();
    }

    var fn = Collision.prototype;

    fn.init = function() {
      this.find_collisions();
    };

    fn.overlaps = function(a, b) {
      var x = false;
      var y = false;

      if ((b.x1 >= a.x1 && b.x1 <= a.x2) ||
          (b.x2 >= a.x1 && b.x2 <= a.x2) ||
          (a.x1 >= b.x1 && a.x2 <= b.x2)
      ) { x = true; }

      if ((b.y1 >= a.y1 && b.y1 <= a.y2) ||
          (b.y2 >= a.y1 && b.y2 <= a.y2) ||
          (a.y1 >= b.y1 && a.y2 <= b.y2)
      ) { y = true; }

      return (x && y);
    };

    fn.detect_overlapping_region = function(a, b){
      var regionX = '';
      var regionY = '';

      if (a.y1 > b.cy && a.y1 < b.y2) { regionX = 'N'; }
      if (a.y2 > b.y1 && a.y2 < b.cy) { regionX = 'S'; }
      if (a.x1 > b.cx && a.x1 < b.x2) { regionY = 'W'; }
      if (a.x2 > b.x1 && a.x2 < b.cx) { regionY = 'E'; }

      return (regionX + regionY) || 'C';
    };

    fn.calculate_overlapped_area_coords = function(a, b){
      var x1 = Math.max(a.x1, b.x1);
      var y1 = Math.max(a.y1, b.y1);
      var x2 = Math.min(a.x2, b.x2);
      var y2 = Math.min(a.y2, b.y2);

      return $({
          left: x1,
          top: y1,
          width : (x2 - x1),
          height: (y2 - y1)
        }).coords().get();
    };

    fn.calculate_overlapped_area = function(coords){
      return (coords.width * coords.height);
    };

    fn.manage_colliders_start_stop = function(new_colliders_coords, start_callback, stop_callback){
      var last = this.last_colliders_coords;

      for (var i = 0, il = last.length; i < il; i++) {
          if ($.inArray(last[i], new_colliders_coords) === -1) {
              start_callback.call(this, last[i]);
          }
      }

      for (var j = 0, jl = new_colliders_coords.length; j < jl; j++) {
          if ($.inArray(new_colliders_coords[j], last) === -1) {
              stop_callback.call(this, new_colliders_coords[j]);
          }

      }
    };

    fn.find_collisions = function(){
      var self = this;
      var colliders_coords = [];
      var colliders_data = [];
      var $colliders = (this.colliders || this.$colliders);
      var count = $colliders.length;

      while(count--){
        var $collider = self.$colliders ? $($colliders[count]) : $colliders[count];
        var player_coords = self.$element.coords().update().get();
        var $collider_coords_ins = ($collider.isCoords) ?
                $collider.update() : $collider.coords();
        var collider_coords = $collider_coords_ins.get();
        var overlaps = self.overlaps(player_coords, collider_coords);

        if (!overlaps) {
          continue;
        }

        var region = self.detect_overlapping_region(player_coords,
             collider_coords);
        //todo: make this if customizable
        if (region === 'C'){
            var area_coords = self.calculate_overlapped_area_coords(
                 player_coords, collider_coords);
            var area = self.calculate_overlapped_area(area_coords);
            var collider_data = {
                area: area,
                area_coords : area_coords,
                region: region,
                coords: collider_coords,
                player_coords: player_coords,
                el: $collider
            };

            self.options.on_overlap.call(this, collider_data);
            colliders_coords.push($collider_coords_ins);
            colliders_data.push(collider_data);
        }

      }

      this.manage_colliders_start_stop(colliders_coords,
          self.options.on_overlap_stop, self.options.on_overlap_start);

      this.last_colliders_coords = colliders_coords;

      return colliders_data;
    };


    fn.get_closest_colliders = function(){
      var colliders = this.find_collisions();
      var min_area = 100;
      colliders.sort(function(a, b){

          if (a.area <= min_area) {
            return 1;
          }

          /* if colliders are being overlapped by the "C" (center) region,
           * we have to set a lower index in the array to which they are placed
           * above in the grid. */
          if (a.region === 'C' && b.region === 'C') {
            if (a.coords.y1 < b.coords.y1 || a.coords.x1 < b.coords.x1) {
                return - 1;
            }else{
                return 1;
            }
          }

          if (a.area < b.area){
             return 1;
          }

          return 1;
      });
      return colliders;
    };

    //jQuery adapter
    $.fn.collision = function(collider, options) {
      return new Collision( this, collider, options );
    };


}(jQuery, window, document));
