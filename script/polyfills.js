(function () {
  window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
})();
