var Aggregator = require("../lib/aggregator");
var util = require("util");

var aggregator = new Aggregator({
  groupBy: [
    ["type"]
  ]
});

var sampleData = [
  { type: "type1", parameter1: true, parameter2: false },
  { type: "type2", parameter1: false, parameter2: false },
  { type: "type1", parameter1: true, parameter2: false },
  { type: "type1", parameter1: true, parameter2: true, parameter3: 5 },
  { type: "type2", parameter1: "test", parameter2: false }
];

sampleData.forEach(aggregator.process.bind(aggregator));

console.log(util.inspect(aggregator.export(), false, null));