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

  // First compute the point to point distance matrix
  // to allow computing epsilon if it's not provided
  for(var j=0; j<points.length; j++) {
    for(var i=0; i<points.length; i++) {
      M[j][i] = norm(points[i], points[j]);
    }
  }

  // if needed, compute espilon as the average distance between points
  if(epsilon === undefined) {
    epsilon = numeric.sum(M) / (Math.pow(points.length, 2) - points.length);
  }

  // update the matrix to reflect the requested distance function
  for(var j=0; j<points.length; j++) {
    for(var i=0; i<points.length; i++) {
      M[j][i] = distance(M[j][i], epsilon);
    }
  }

  // determine dimensionality of target values
  var sample = values[0];
  var D = typeof sample === 'number'
    ? 1
    : sample.length;

  // generalize to vector values
  if(D === 1) {
    values = values.map(function(value) {
      return [value];
    });
  }

  // reshape values by component
  var tmp = new Array(D);
  for(var i=0; i<D; i++) {
    tmp[i] = values.map(function(value) {
      return value[i];
    });
  }
  values = tmp;

  // Compute basis functions weights by solving
  // the linear system of equations for each target component
  var w = new Array(D);
  var LU = numeric.LU(M);
  for(var i=0; i<D; i++) {
    w[i] = numeric.LUsolve(LU, values[i]);
  }

  // The returned interpolant will compute the value at any point 
  // by summing the weighted contributions of the input points
  function interpolant(p) {
    
    var distances = new Array(points.length);
    for(var i=0; i<points.length; i++) {
      distances[i] = norm(p, points[i], epsilon);
    }

    var sums = new Array(D);
    for(var i=0; i<D; i++) {
      sums[i] = numeric.sum(numeric.mul(distances, w[i]));
    }

    return sums;
  }

  return interpolant;
}


function norm(pa, pb) {
  return numeric.norm2(numeric.sub(pb, pa));
}

function distanceLinear(r) {
  return r;
}

function distanceCubic(r) {
  return Math.pow(r, 3);
}

function distanceQuintic(r) {
  return Math.pow(r, 5);
}

function distanceThinPlate(r) {
  if(r === 0) return 0;
  return Math.pow(r, 2) * Math.log(r);
}

function distanceGaussian(r, epsilon) {
  return Math.exp(- Math.pow(r / epsilon, 2));
}

function distanceInverseMultiquadric(r, epsilon) {
  return 1.0 / Math.sqrt(Math.pow(r / epsilon, 2) + 1);
}

function distanceMultiquadric(r, epsilon) {
  return Math.sqrt(Math.pow(r / epsilon, 2) + 1);
}

module.exports = RBF;