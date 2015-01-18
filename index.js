(function() {

  // Node
  if(typeof module !== 'undefined' && module.exports) {
    var numeric = require('numeric');
    onload(numeric);
  }
  // AMD
  else if(typeof define !== 'undefined' && define.amd) {
    define(['numeric'], onload);
  }
  // Browser
  else {
    onload(window.numeric);
  }

  function onload(numeric) {

    function distanceLinear(pa, pb) {
      return numeric.norm2(numeric.sub(pb, pa));
    }

    function distanceCubic(pa, pb) {
      return Math.pow(distanceLinear(pa, pb), 3);
    }

    var distanceFunctions = {
      'linear': distanceLinear,
      'cubic':  distanceCubic
    };

    function RBF(points, values, distanceFunction) {

      var distance = distanceFunctions.linear;

      if(distanceFunction) {
        distance = typeof distanceFunction !== 'string'
          ? distanceFunction
          : distanceFunctions[distanceFunction];
      }

      // `identity` here serves as a shorthand to allocate
      // the matrix nested array.
      var M = numeric.identity(points.length);

      for(var j=0; j<points.length; j++) {
        for(var i=0; i<points.length; i++) {
          M[j][i] = distance(points[i], points[j]);
        }
      }

      // Compute basis functions weights by solving
      // the linear system of equations
      var invM = numeric.inv(M);
      var w = numeric.dot(invM, values);

      // The returned interpolant will compute the value at any point 
      // by summing the weighted contributions of the input points
      function interpolant(p) {
        var distances = points.map(function(point) {
          return distance(p, point);
        });

        var products = numeric.mul(distances, w);
        var sum = products.reduce(function(acc, value) {
          return acc + value;
        }, 0);

        return sum;
      }

      return interpolant;
    }

    // Node
    if(typeof module !== 'undefined' && module.exports) {
      module.exports = RBF;
    }
    // AMD
    else if(typeof define !== 'undefined' && define.amd) {
      return RBF;
    }
    // Browser
    else {
      window.RBF = RBF;
    }  

  } // onload

})();