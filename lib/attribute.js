var _ = require("lodash");

/**
 * Attribute constructor. Represents a single attribute
 * in a group at a given path.
 */
function Attribute(path) {
  this._path = path;
  this._sampleValue = null;
  this._occurances = 0;
}

/**
 * Returns true if the given path matches the attribute's path.
 */
Attribute.prototype.match = function (path) {
  return _.isEqual(this._path, path);
};

/**
 * Processes an occurance of the attribute.
 */
Attribute.prototype.processOccurance = function (value) {
  this._occurances += 1;
  if (this._sampleValue === null) {
    this._sampleValue = value;
  }
};

/**
 * Exports a JSON-friendly view of the attribute.
 */
Attribute.prototype.export = function () {
  return {
    path: this._path,
    occurances: this._occurances,
    sampleValue: this._sampleValue
  };
};

module.exports = Attribute;