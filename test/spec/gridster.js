describe('Gridster', function() {

    var grid_tpl = $('#gridster-tpl').html();

    var move = function(x, y) {
        x || (x = 0);
        y || (y = 0);
        var sx = '' + (x || '0');
        var sy = '' + (y || '0');
        x >= 0 && (sx = '+' + sx);
        y >= 0 && (sy = '+' + sy);

        return sx + ' ' + sy;
    };

    var coords = function($w) {
        return $w.data('coords');
    };

    var wgd = function($w) {
        return coords($w).grid;
    };


    before(function() {

        this.unit_x = 100;
        this.unit_y = 55;

        $('#gridster-wrapper').html(grid_tpl);

        this.gridster = $(".gridster ul").gridster({
          widget_base_dimensions: [this.unit_x, this.unit_y],
          widget_margins: [5, 5],
          helper: 'clone',
          min_cols: 6,
          resize: {
            enabled: true
          }
        }).data('gridster');

        this.gridmap = this.gridster.gridmap;

        this.gridster.$widgets.each($.proxy(function(i) {
            this['$w'+ i] = this.gridster.$widgets.eq(i);
        }, this));

    });

    after(function() {
        return;
        this.gridster.destroy();
        delete this.gridster;
    });

    it('should return Gridster instance', function() {
        expect(this.gridster).to.respondTo('disable');
    });


    describe('Drag a widget one cell to the right', function() {

        before(function(done) {
            var self = this;
            expect(function() {
                Syn.drag(move(self.unit_x), self.$w0, function() {

                    done();
                });
            }).to.not.throw(Error);
        });


        it('should change the widget column to the new one', function() {
            // expect(wgd(this.$w0).col).to.equal(1);
            // expect(this.$w0.attr('data-col')).to.equal("1");

            expect(wgd(this.$w0).col).to.equal(2);
            expect(this.$w0.attr('data-col')).to.equal("2");
        });

        it('should stay on the same row', function() {
            expect(wgd(this.$w0).row).to.equal(1);
        });

        it('should maintain the same widget size', function() {
            expect(wgd(this.$w0).size_x).to.equal(2);
            expect(wgd(this.$w0).size_y).to.equal(2);
            expect(this.$w0.attr('data-sizex')).to.equal("2");
            expect(this.$w0.attr('data-sizey')).to.equal("2");
        });

        it('should not leave empty spaces at left if there are widgets below', function() {
            expect(this.gridmap[1][1][0]).to.equal(this.$w5[0]);
            expect(this.gridmap[1][2][0]).to.equal(this.$w4[0]);
        });

        it('should push down widgets previously positioned in the new column occupied', function() {
            expect(this.gridmap[3][3][0]).to.equal(this.$w1[0]);
            expect(this.gridmap[2][5][0]).to.equal(this.$w3[0]);
            expect(this.gridmap[2][6][0]).to.equal(this.$w6[0]);
            expect(this.gridmap[2][7][0]).to.equal(this.$w7[0]);
            expect(this.gridmap[4][6][0]).to.equal(this.$w8[0]);
        });

    });



    describe('Drag the widget left to its original position', function() {

        before(function(done) {
            var self = this;
            expect(function() {
                Syn.drag(move(-self.unit_x), self.$w0, function() {
                    done();
                });
            }).to.not.throw(Error);
        });

        it('should change the widget column to its original', function() {
            expect(wgd(this.$w0).col).to.equal(1);
            expect(this.$w0.attr('data-col')).to.equal("1");
        });

        it('should stay on the same row', function() {
            expect(wgd(this.$w0).row).to.equal(1);
        });

        it('should maintain the same widget size', function() {
            expect(wgd(this.$w0).size_x).to.equal(2);
            expect(wgd(this.$w0).size_y).to.equal(2);
            expect(this.$w0.attr('data-sizex')).to.equal("2");
            expect(this.$w0.attr('data-sizey')).to.equal("2");
        });

        it('should not leave empty spaces at right if there are widgets below', function() {
            expect(this.gridmap[3][1][0]).to.equal(this.$w1[0]);
            expect(this.gridmap[2][3][0]).to.equal(this.$w3[0]);
            expect(this.gridmap[2][4][0]).to.equal(this.$w6[0]);
            expect(this.gridmap[2][5][0]).to.equal(this.$w7[0]);
            expect(this.gridmap[4][4][0]).to.equal(this.$w8[0]);
        });

        it('should push down widgets previously positioned in the new column occupied', function() {
            expect(this.gridmap[1][3][0]).to.equal(this.$w5[0]);
            expect(this.gridmap[1][4][0]).to.equal(this.$w4[0]);
        });
    });


    describe('Drag the widget down one cell', function() {
        before(function(done) {
            var self = this;
            expect(function() {
                Syn.drag(move(0, self.unit_y * wgd(self.$w0).size_y), self.$w0, function() {
                    done();
                });
            }).to.not.throw(Error);
        });

        it('should change the widget row to the new one', function() {
            expect(wgd(this.$w0).row).to.equal(2);
            expect(this.$w0.attr('data-row')).to.equal("2");
        });

        it('should stay on the same col', function() {
            expect(wgd(this.$w0).col).to.equal(1);
        });

        it('should leave widgets below to go up', function() {
            expect(this.gridmap[1][1][0]).to.equal(this.$w5[0]);
        });

        it('should push down widgets previously positioned in the new row occupied', function() {
            expect(this.gridmap[1][4][0]).to.equal(this.$w4[0]);
            expect(this.gridmap[2][4][0]).to.equal(this.$w3[0]);
            expect(this.gridmap[2][5][0]).to.equal(this.$w6[0]);
            expect(this.gridmap[2][6][0]).to.equal(this.$w7[0]);
            expect(this.gridmap[4][5][0]).to.equal(this.$w8[0]);
        });
    });


    describe('Drag the widget down a bit more', function() {
        before(function(done) {
            var self = this;
            expect(function() {
                Syn.drag(move(0, self.unit_y * 0.6), self.$w0, function() {
                    done();
                });
            }).to.not.throw(Error);
        });

        it('should change the widget row to the new one', function() {
            expect(wgd(this.$w0).row).to.equal(2);
            expect(this.$w0.attr('data-row')).to.equal("2");
        });

        it('should stay on the same col', function() {
            expect(wgd(this.$w0).col).to.equal(1);
        });

        it('should not leave widgets below to go up', function() {
            expect(this.gridmap[2][1][0]).to.equal(false);
            expect(this.gridmap[2][5][0]).to.equal(this.$w6[0]);
        });

        // it('should push down widgets previously positioned in the new row occupied', function() {
        //     expect(this.gridmap[1][4][0]).to.equal(this.$w4[0]);
        //     expect(this.gridmap[2][4][0]).to.equal(this.$w3[0]);
        //     expect(this.gridmap[2][5][0]).to.equal(this.$w6[0]);
        //     expect(this.gridmap[2][6][0]).to.equal(this.$w7[0]);
        //     expect(this.gridmap[4][5][0]).to.equal(this.$w8[0]);
        // });
    });



    // Syn.drag("+100 +0", $w.find('.gs-resize-handle-x'), function() {
    //     expect($w.data('coords').grid.size_x).to.equal(3);
    //     done();
    // });

    // describe('Drag&resize', function() {

    //     it('should be one cell wider', function(done) {
    //         var $w = this.gridster.$widgets.eq(0);

    //         expect(wgd($w).size_x).to.equal(2);

    //         expect(function() {
    //             Syn.drag(move(100), $w.find('.gs-resize-handle-x'), function() {
    //                 expect(wgd($w).size_x).to.equal(3);
    //                 done();
    //             });

    //         }).to.not.throw(Error);

    //     });

    // });


});
