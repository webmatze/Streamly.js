describe("streamlyjs", function() {
    "use strict";

    var Streamly = window.Streamly;

    it("should create a Streamly.EventStream", function() {
      var stream = new Streamly.EventStream();
      expect(stream instanceof Streamly.EventStream).toBe(true);
    });

    describe("with stream", function() {
      var stream = null;
      beforeEach(function() {
        stream = new Streamly.EventStream();
      });
      it("should have no inital listener", function() {
        var listener = function(value) {};
        expect(stream.listeners.length).toBe(0);
      });
      it("should register listener", function() {
        var listener = function(value) {};
        stream.onValue(listener);
        expect(stream.listeners.length).toBe(1);
      });
      it("should not be a property", function() {
        expect(stream.isProperty).toBe(false);
      });
      it("should not have a value", function() {
        expect(stream.value).toBeNull();
      });
      it("should not be activated", function() {
        expect(stream.isActivated).toBe(false);
      });

    });
});
