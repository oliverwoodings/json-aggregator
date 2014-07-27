var _ = require("lodash");

var Group = require("./group");

/**
 * Aggregator constructor.
 */
function Aggregator(config) {
  this._config = _.extend(Aggregator.DEFAULTS, config);
  this._groups = [];
}

/**
 * Default config values
 */
Aggregator.DEFAULTS = {
  groupBy: [
    ["page", "category"]
  ]
};

/**
 * Processes a single tree into the aggregator
 */
Aggregator.prototype.process = function (tree) {
  //Group the object then process it. Only process if the object
  //actually falls into a group.
  var group = this._getGroup(tree);
  if (group) {
    group.processOccurance(tree);
  }
};

/**
 * Exports a JSON-friendly view of the aggregator results.
 */
Aggregator.prototype.export = function () {
  return _.invoke(this._groups, "export");
};

/**
 * Return the group for the inputted tree. Creates the group
 * if it doesn't exist yet.
 */
Aggregator.prototype._getGroup = function (tree) {
  var keys = this._generateKeys(tree);
  if (_.isEmpty(keys)) {
    return false;
  }
  var existingGroup = _.find(this._groups, function (group) {
    return group.match(keys);
  });
  if (existingGroup) {
    return existingGroup;
  } else {
    var newGroup = new Group(keys);
    this._groups.push(newGroup);
    return newGroup;
  }
};

/**
 * Returns the group 'keys' for a given tree.
 */
Aggregator.prototype._generateKeys = function (tree) {
  var keys = [];
  _.each(this._config.groupBy, function (path) {
    var val = this._getPathValue(tree, path);
    if (val) {
      keys.push({
        path: path,
        value: val
      });
    }
  }, this);
  return keys;
};

/**
 * Returns the value from a tree at a given path.
 */
Aggregator.prototype._getPathValue = function (tree, path) {
  if (path.length === 1 && tree[path[0]]) {
    return tree[path[0]];
  }
  var toMatch = path[0];
  if (tree instanceof Array) {
    for (var i = 0; i < tree.length; i++) {
      return this._getPathValue(tree[i], path);
    }
  } else {
    for (var key in tree) {
      if (key === toMatch) {
        return this._getPathValue(tree[key], path.slice(1));
      }
    }
  }
};

module.exports = Aggregator;