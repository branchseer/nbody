(function () { 

  var threshold = 0.01;
  var collisionR = 15;

  var G = 1;

  var getBoundary = function (bodies) {
    var minX = Infinity;
    var minY = Infinity;
    var maxX = -Infinity;
    var maxY = -Infinity;

    for (var i = bodies.length - 1; i >= 0; i--) {
      var body = bodies[i];

      if (body.x < minX) {
        minX = body.x;
      }
      if (body.x > maxX) {
        maxX = body.x;
      }

      if (body.y < minY) {
        minY = body.y;
      }
      if (body.y > maxY) {
        maxY = body.y;
      }
    }
    return {
      centerX: (minX + maxX) / 2,
      centerY: (minY + maxY) / 2,
      r: Math.max(maxX - minX, maxY - minY)
    }
  }

  var divideMatrix = [
    [1, 1],
    [-1, 1],
    [-1, -1],
    [1, -1]
  ];
  var divide = function (boundary) {
    var result = [];
    for (var i = 0, len = divideMatrix.length; i < len; i++) {
      result.push({
        r: boundary.r / 2,
        centerX: boundary.centerX + boundary.r / 4 * divideMatrix[i][0],
        centerY: boundary.centerY + boundary.r / 4 * divideMatrix[i][1]
      });
    }
    return result;
  };

  var getQuadrant = function (body, boundary) {
    if (body.x >= boundary.centerX) {
      if (body.y >= boundary.centerY) {
        return 0;
      }
      return 3;
    }
    if (body.y >= boundary.centerY) {
      return 1;
    }
    return 2;
  };

  var getDistance = function (a, b) {
    var deltaX = a.x - b.x;
    var deltaY = a.y - b.y;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  };

  var insertBody = function (node, body) {
    if (node.body) {
      if (getDistance(node.body, body) < collisionR) {//collision
        body.deleted = true;

        var newMass = node.body.mass + body.mass;
        console.log(node.boundary.r, node.body.mass, body.mass);

        node.body.vx = (node.body.vx * node.body.mass + body.vx * body.mass) / newMass;
        node.body.vy = (node.body.vy * node.body.mass + body.vy * body.mass) / newMass;
        node.body.x = (node.body.x * node.body.mass + body.x * body.mass) / newMass;
        node.body.y = (node.body.y * node.body.mass + body.y * body.mass) / newMass;

        node.body.mass = newMass;
      }
      else {//external to internal
        var childNodes = new Array(4);
        var quadrants = divide(node.boundary);
        for (var i = quadrants.length - 1; i >= 0; i--) {
          childNodes[i] = {
            boundary: quadrants[i]
          };
        }
  
        childNodes[getQuadrant(node.body, node.boundary)].body = node.body
        insertBody(childNodes[getQuadrant(body, node.boundary)], body);
        node.childNodes = childNodes;
  
        node.mass = node.body.mass + body.mass;
        node.x = (node.body.x * node.body.mass + body.x * body.mass) / node.mass;
        node.y = (node.body.y * node.body.mass + body.y * body.mass) / node.mass;
        node.body = null;
      }
    }
    else {
      if (!node.childNodes) {//add to empty external node
        node.body = body;
      }
      else {
        insertBody(node.childNodes[getQuadrant(body, node.boundary)], body);
        var newMass = node.mass + body.mass;
        node.x = (node.x * node.mass + body.x * body.mass) / newMass;
        node.y = (node.y * node.mass + body.y * body.mass) / newMass;
        node.mass = newMass;
      }
    }
  };

  var getForce = function (a, b) {
    var deltaX = b.x - a.x;
    var deltaY = b.y - a.y;
    var r = getDistance(a, b);
    var unitF = G * a.mass * b.mass / (r * r * r);
    return {
      x: unitF * deltaX,
      y: unitF * deltaY
    };
  }

  var clacForce = function (body, node) {
    var nodeBody = null;
    if (node.body) {//external node
      nodeBody = node.body;
    }
    else if (node.boundary.r / getDistance(body, node) < threshold) {//s/d < θ
      nodeBody = node;
    }

    if (nodeBody) {
      var force = getForce(body, nodeBody);
      body.forceX += force.x;
      body.forceY += force.y;
    }
    else {
      if (!node.childNodes) return;
      for (var i = node.childNodes.length; i >= 0; i--) {
        if (node.childNodes[i]) clacForce(body, node.childNodes[i]);
      }
    }
  }

  window.gravity = function (bodies) {
    var rootNode = {
      boundary: getBoundary(bodies)
    };

    //build tree
    for (var i = bodies.length - 1; i >= 0; i--) {
      insertBody(rootNode, bodies[i]);
    }

    //delete collision
    var deletedCount = 0;
    for (var i = 0, len = bodies.length; i < len - deletedCount; i++) {
      if (bodies[i].deleted) {
        deletedCount++;
        i--;
      }
      bodies[i + 1] = bodies[i + 1 + deletedCount];
    }
    bodies.length -= deletedCount;

    //calculate forces
    for (var i = bodies.length - 1; i >= 0; i--) {
      bodies[i].forceX = 0;
      bodies[i].forceY = 0;
      clacForce(bodies[i], rootNode);
    }


    //console.log(rootNode);
    //console.log(bodies);
    
  };

})();
