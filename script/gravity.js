window.getForces = function (bodies, G) {
  var forces = [];
  for (var i = 0, len = bodies.length; i < len; i++) {
    var fxSum = 0, fySum = 0;

    for (var j = 0; j < len; j++) {
      if (j !== i) {
        var deltaX = bodies[j].x - bodies[i].x;
        var deltaY = bodies[j].y - bodies[i].y;

        var r = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        var unitF = G * bodies[i].mass * bodies[j].mass / (r * r * r);

        fxSum += unitF * deltaX;
        fySum += unitF * deltaY;
      }
    }

    forces.push({
      x: fxSum,
      y: fySum
    });
  }

  return forces;
}
