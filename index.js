var numeric = require('numeric');


var distanceFunctions = {
  'linear': distanceLinear,
  'cubic':  distanceCubic,
  'quintic': distanceQuintic,
  'thin-plate': distanceThinPlate,
  'gaussian': distanceGaussian,
  'inverse-multiquadric': distanceInverseMultiquadric,
  'multiquadric': distanceMultiquadric
};


function RBF(points, values, distanceFunction, epsilon) {

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
      M[j][i] = distance(points[i], points[j], epsilon);
    }
  }

  // Compute basis functions weights by solving
  // the linear system of equations
  var LU = numeric.LU(M);
  var w = numeric.LUsolve(LU, values);

  // The returned interpolant will compute the value at any point 
  // by summing the weighted contributions of the input points
  function interpolant(p) {
    var distances = points.map(function(point) {
      return distance(p, point, epsilon);
    });

    var products = numeric.mul(distances, w);
    var sum = products.reduce(function(acc, value) {
      return acc + value;
    }, 0);

    return sum;
  }

  return interpolant;
}


function distanceLinear(pa, pb) {
  return numeric.norm2(numeric.sub(pb, pa));
}

function distanceCubic(pa, pb) {
  return Math.pow(distanceLinear(pa, pb), 3);
}

function distanceQuintic(pa, pb) {
  return Math.pow(distanceLinear(pa, pb), 5);
}

function distanceThinPlate(pa, pb) {
  var r = distanceLinear(pa, pb);
  if(r === 0) return 0;
  return Math.pow(r, 2) * Math.log(r);
}

function distanceGaussian(pa, pb, epsilon) {
  var r = distanceLinear(pa, pb);
  return Math.exp(- Math.pow(r / epsilon, 2));
}

function distanceInverseMultiquadric(pa, pb, epsilon) {
  var r = distanceLinear(pa, pb);
  return 1.0 / Math.sqrt(Math.pow(r / epsilon, 2) + 1);
}

function distanceMultiquadric(pa, pb, epsilon) {
  var r = distanceLinear(pa, pb);
  return Math.sqrt(Math.pow(r / epsilon, 2) + 1);
}

module.exports = RBF;