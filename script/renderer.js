window.Renderer = (function () {
  var MINMASS = 1;
  var MAXMASS = 1e7;
  var MINRADIUS = 1;
  var MAXRADIUS = 8;
  var deviceRatio = window.devicePixelRatio || 1;

  function massToRadius(mass) {
    return MINRADIUS + (mass - MINMASS) / (MAXMASS - MINMASS) * (MAXRADIUS - MINRADIUS);
  }

  var getContext = function (canvas) {
    canvas._context = canvas._context || canvas.getContext('2d');
    if (!canvas._drawed) {
      canvas._context.scale(deviceRatio, deviceRatio);
      canvas._drawed = true;
    }
    return canvas._context;
  }

  var resizeCanvas = function (canvas) {
    canvas.width = canvas.offsetWidth * deviceRatio;
    canvas.height = canvas.offsetHeight * deviceRatio;
    canvas._drawed = false;
  }

  function Renderer(worldCanvas, pathCanvas) {
    var self = this;
    this.worldCanvas = worldCanvas;
    this.pathCanvas = pathCanvas;


    var onResize = function () {
      resizeCanvas(worldCanvas);
      resizeCanvas(pathCanvas)
    };


    onResize();

    window.onresize = onResize;

    this.bodies = [];
  }

  Renderer.prototype.getContext = function () {
    var context = this.worldCanvas.getContext('2d');
    return context;
  }

  Renderer.prototype.redraw = function () {
    var ctx = getContext(this.worldCanvas);

    ctx.clearRect(0, 0, this.worldCanvas.width, this.worldCanvas.height);
    for (var i = 0, len = this.bodies.length; i < len; i++) {
      var body = this.bodies[i];
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(body.x, body.y, massToRadius(body.mass), 0, Math.PI*2, true);
      ctx.closePath();
      ctx.fill();
    }

    if (this.drawPath) {
      var pathCtx = getContext(this.pathCanvas);

      for (var i = 0, len = this.bodies.length; i < len; i++) {
        var body = this.bodies[i];

        if (!('lastx' in body)) {
          body.lastx = body.x;
          body.lasty = body.y;
          continue;
        }
        pathCtx.strokeStyle = "gray";
        pathCtx.beginPath();
        pathCtx.moveTo(body.lastx, body.lasty);
        pathCtx.lineTo(body.x, body.y);
        pathCtx.stroke();

        body.lastx = body.x;
        body.lasty = body.y;
      }
    }
  };

  Renderer.prototype.startAnimation = function () {
    this.started = true;
    var self = this;

    var start = null;
    requestAnimationFrame(function step(timestamp) {
      if (start === null) {
        start = timestamp;
        return requestAnimationFrame(step);
      }

      if (self.beforeRedraw) {
        self.beforeRedraw(timestamp - start);
      }

      start = timestamp;
      self.redraw();
      if (self.started) {
        requestAnimationFrame(step);
      }
    });
  };

  Renderer.prototype.pauseAnimation = function () {
    this.started = false;
  }

  Renderer.prototype.addBody = function (body) {
    return this.bodies.push(body) - 1;
  };

  return Renderer;
})();
