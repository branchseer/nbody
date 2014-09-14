window.renderer = (function () {
  var renderer = new Renderer(document.getElementById('world'), document.getElementById('path'));
  renderer.drawPath = true;
  var ox = 200;
  var oy = 100;
/*
  renderer.addBody({
    x: ox + 100,
    y: oy + 0,
    mass: 5e6,
    vx: 30,
    vy: 0
  });
*/
  renderer.addBody({
    x: ox + 100,
    y: oy + 100,
    mass: 3e6,
    vx: 0,
    vy: 100
  });
  
  renderer.addBody({
    x: ox + 100,
    y: oy + 105,
    mass: 5e6,
    vx: 0,
    vy: -100
  });

  renderer.addBody({
    x: ox + 200,
    y: oy + 205,
    mass: 2e6,
    vx: 0,
    vy: -100
  });

  renderer.addBody({
    x: ox + 100,
    y: oy + 205,
    mass: 1e6,
    vx: 0,
    vy: -100
  });

  renderer.addBody({
    x: ox + 200,
    y: oy + 100,
    mass: 3e6,
    vx: 0,
    vy: -100
  });

  renderer.addBody({
    x: ox + 200,
    y: oy + 180,
    mass: 3e6,
    vx: 0,
    vy: -100
  });

  var G = 1;
  
  var bodies = renderer.bodies;
  gravity(bodies, G, 20);
  var oldForces = [];

  renderer.beforeRedraw = function (dt) {
    //dt /= 1000;
    dt = 20 / 1000;

    oldForces.length = bodies.length;
    for (var i = 0, len = bodies.length; i < len; i++) {
      bodies[i].x += bodies[i].vx * dt + bodies[i].forceX / (2 * bodies[i].mass) * dt * dt;
      bodies[i].y += bodies[i].vy * dt + bodies[i].forceY / (2 * bodies[i].mass) * dt * dt;

      oldForces[i] = {
        x: bodies[i].forceX,
        y: bodies[i].forceY
      };
    }

    gravity(bodies, G, 20);

    for (var i = 0, len = bodies.length; i < len; i++) {
      bodies[i].vx += (oldForces[i].x + bodies[i].forceX) / (2 * bodies[i].mass) * dt;
      bodies[i].vy += (oldForces[i].y + bodies[i].forceY) / (2 * bodies[i].mass) * dt; 
    }

  };

  return renderer;
  
})();
