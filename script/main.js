window.renderer = (function () {
  var renderer = new Renderer(document.getElementById('world'), document.getElementById('path'));
  renderer.drawPath = true;
  var ox = 200;
  var oy = 100;

  renderer.addBody({
    x: ox + 100,
    y: oy + 0,
    mass: 5e6,
    vx: 30,
    vy: 0
  });

  renderer.addBody({
    x: ox + 100,
    y: oy + 100,
    mass: 5e6,
    vx: -250,
    vy: 0
  });
  
  renderer.addBody({
    x: ox + 150,
    y: oy + 200,
    mass: 5e6,
    vx: 220,
    vy: 0
  });

  
  var G = 1;
  
  var bodies = renderer.bodies;
  var forces = getForces(bodies, G);
  console.log(forces);
  
  renderer.beforeRedraw = function (dt) {
    //dt /= 1000;
    dt = 20 / 1000;

    for (var i = 0, len = bodies.length; i < len; i++) {
      bodies[i].x += bodies[i].vx * dt + forces[i].x / (2 * bodies[i].mass) * dt * dt;
      bodies[i].y += bodies[i].vy * dt + forces[i].y / (2 * bodies[i].mass) * dt * dt;
    }

    var nextForces = getForces(bodies, G);

    for (var i = 0, len = bodies.length; i < len; i++) {
      bodies[i].vx += (nextForces[i].x + forces[i].x) / (2 * bodies[i].mass) * dt;
      bodies[i].vy += (nextForces[i].y + forces[i].y) / (2 * bodies[i].mass) * dt; 
    }
    forces = nextForces;

  };

  return renderer;
  
})();
