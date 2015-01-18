rbf
===
### Radial Basis Function (RBF) interpolation for node and the browser

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

var values = [
  0.0,
  1.0
]

var rbf = RBF(points, values);

var value = ;

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
