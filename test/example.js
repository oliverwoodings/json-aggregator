var Aggregator = require("./lib/aggregator");

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
  { type: "type2", parameter1: true, parameter2: false }
];

sampleData.forEach(function (obj) {
  aggregator.process(obj);
});

console.log(JSON.stringify(aggregator.export()));