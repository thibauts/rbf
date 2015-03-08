rbf
===
### Radial Basis Function (RBF) interpolation

Builds Radial Basis Functions for input and output values of arbitrary dimensionality using standard or custom distance functions.

Installation
------------

```bash
$ npm install rbf
```

Usage
-----

```javascript
var RBF = require('rbf');

var points = [
  [0, 0],
  [0, 100]
];

// values could be vectors of any dimensionality.
// The computed interpolant function will return values or vectors accordingly.
var values = [
  0.0,
  1.0
]

// RBF accepts a distance function as a third parameter :
// either one of the following strings or a custom distance function (defaults to 'linear').
//
// - linear: r
// - cubic: r**3
// - quintic: r**5
// - thin-plate: r**2 * log(r)
// - gaussian: exp(-(r/epsilon) ** 2)
// - multiquadric: sqrt((r/epsilon) ** 2 + 1)
// - inverse-multiquadric: 1 / sqrt((r/epsilon) ** 2 + 1)
//
// epsilon can be provided as a 4th parameter. Defaults to the average 
// euclidean distance between points.
//
var rbf = RBF(points, values /*, distanceFunction, epsilon */);

console.log(rbf([0, 50])); // => 0.5
```

Examples
--------

Partial derivative of a gaussian, original and interpolated with 25 random samples (linear distance function).

<img src="http://i.imgur.com/kBrRSRS.png"/>
<img src="http://i.imgur.com/WTDIDjC.png"/>

Lena, original and interpolated with 4000 random samples (about 6% of the original pixels, linear distance function).

<img src="http://i.imgur.com/I3vxACQ.png"/>
<img src="http://i.imgur.com/zLeoJlJ.png"/>
