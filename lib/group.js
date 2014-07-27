var _ = require("underscore");

var Attribute = require("./attribute");

/**
 * Group constructor. Represents a collection of attributes grouped together
 * under a specific set of keys.
 */
function Group(keys) {
  this._keys = keys;
  this._attributes = [];
  this._occurances = 0;
}

/**
 * Returns true if the given keys match the group's keys.
 */
Group.prototype.match = function (keys) {
  return _.isEqual(keys, this._keys);
};

/**
 * Processes an occurance of the group.
 */
Group.prototype.processOccurance = function (tree) {
  this._processTree(tree);
  this._occurances += 1;
};

/**
 * Exports a JSON-friendly view of the group.
 */
Group.prototype.export = function () {

  //Generate multi-dimensional attribute tree from linear attribute array
  var attributes = {};
  _.each(this._attributes, function (attribute) {

    //Before setting the value of the attribute we need to ensure the path to it
    //exists. This is done by looping over the path, maintainig a pointer to the
    //current level.
    var attrValue = attribute.export();
    var path = attrValue.path.slice(0);
    var pointer = attributes;
    while (path.length > 1) {
      var piece = path.shift();
      pointer[piece] = pointer[piece] || {};
      pointer = pointer[piece];
    }

    //Once the path is prepared, set the value of it.
    pointer[path[0]] = attrValue;
  });

  return {
    keys: this._keys,
    attributes: attributes,
    occurances: this._occurances
  };
};

/**
 * Recurse through the given tree, processing the attribute at the end of
 * each branch.
 */
Group.prototype._processTree = function (tree, path) {
  path = path || [];
  if (tree instanceof Array) {
    _.each(tree, function (val) {
      this._processTree(val, path);
    }, this);
  } else if (tree instanceof Object) {
    _.each(tree, function (val, key) {
      var newPath = path.slice(0);
      newPath.push(key);
      this._processTree(val, newPath);
    }, this);
  } else {
    this._processAttribute(path, tree);
  }
};

/**
 * Process the attribute at the given path. Will instantiate a new Attribute
 * if one doesn't exist yet.
 */
Group.prototype._processAttribute = function (path, value) {
  var existingAttribute = _.find(this._attributes, function (attribute) {
    return attribute.match(path);
  });
  if (existingAttribute) {
    existingAttribute.processOccurance(value);
  } else {
    var newAttribute = new Attribute(path);
    this._attributes.push(newAttribute);
    newAttribute.processOccurance(value);
  }
};


module.exports = Group;