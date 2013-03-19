describe('Coords', function() {
    beforeEach(function() {
        this.coords = $({
            left: 10,
            top: 10,
             width : 100,
            height: 200
          }).coords();
    });
    
    afterEach(function() {
        delete this.coords;
    });
    
    
    it('should return Coords instance', function() {
        expect(this.coords.isCoords).to.be.true;
    });
});
