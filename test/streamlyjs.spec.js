describe("streamlyjs", function() {
    "use strict";

    var Streamly = window.streamlyjs;

    it("should create a Streamly.EventStream", function() {
      var stream = new Streamly.EventStream();
      expect(stream instanceof Streamly.EventStream).toBe(true);
    });
});
