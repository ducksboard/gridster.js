describe('Collision', function() {
    beforeEach(function() {
        this.colliders = [
            $({left: 0, top: 0, width : 100, height: 100 }).coords(),
            $({left: 0, top: 100, width : 100, height: 100 }).coords(),
            $({left: 100, top: 0, width : 100, height: 100 }).coords(),
            $({left: 100, top: 100, width : 100, height: 100 }).coords()
        ];

        this.collision = $('<div />').collision(this.colliders);
    });
    
    afterEach(function() {
        delete this.colliders;
        delete this.collision;
    });
    
    it('should return Collision instance', function() {
        expect(this.collision).property('last_colliders');
    });
});
