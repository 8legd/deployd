var q = require('q');

// Similar to q.ninvoke, but returns the first argument (instead of the second)
exports.cinvoke = function(obj, func) {
  var args = Array.prototype.slice.call(arguments, 2);

  var d = q.defer();

  if (typeof func !== 'function') {
    func = obj[func];
  }

  var callback = function(result) {
    d.resolve(result);
  };

  args.push(callback);

  func.apply(obj, args);

  return d.promise;

};

// Convert a promise to a callback
exports.qcallback = function(promise, callback) {
  if (typeof promise === 'function') {
    promise = q.fcall(promise);
  }

  promise.then(function(result) {
    callback(null, result);
  }, function(err) {  
    callback(err);
  });
};

exports.spreadObject = function(obj) {
  var valuesQ = Object.keys(obj).map(function(k) {
    return q.when(obj[k], function(v) {
      return {
          key: k
        , value: v
      };
    });
  });

  return q.all(valuesQ).then(function(values) {
    var result = {};
    values.forEach(function(v) {
      result[v.key] = v.value;
    });
    return result;
  });
}