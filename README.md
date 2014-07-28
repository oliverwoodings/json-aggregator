# json-aggregator

Aggregates a set of similar JSON objects into a report on their schema. The report is controlled by specifying group 'paths' that are used to determine what counts as 'similar' objects.

An example use is grouping and reporting on the schema of a website's data layer, e.g. Qubit's Universal Variable.

## Usage

```javascript
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

console.log(aggregator.export());
```

Here is the output of the above:

```javascript
{
  occurances: 5,
  attributes: {
    type: {
      path: ['type'],
      occurances: 5,
      sampleValue: 'type1',
      types: ['string']
    },
    parameter1: {
      path: ['parameter1'],
      occurances: 5,
      sampleValue: true,
      types: ['boolean', 'string']
    },
    parameter2: {
      path: ['parameter2'],
      occurances: 5,
      sampleValue: false,
      types: ['boolean']
    },
    parameter3: {
      path: ['parameter3'],
      occurances: 1,
      sampleValue: 5,
      types: ['number']
    }
  },
  groups: [{
    keys: [{
      path: ['type'],
      value: 'type1'
    }],
    occurances: 3,
    attributes: {
      type: {
        path: ['type'],
        occurances: 3,
        sampleValue: 'type1',
        types: ['string']
      },
      parameter1: {
        path: ['parameter1'],
        occurances: 3,
        sampleValue: true,
        types: ['boolean']
      },
      parameter2: {
        path: ['parameter2'],
        occurances: 3,
        sampleValue: false,
        types: ['boolean']
      },
      parameter3: {
        path: ['parameter3'],
        occurances: 1,
        sampleValue: 5,
        types: ['number']
      }
    }
  }, {
    keys: [{
      path: ['type'],
      value: 'type2'
    }],
    occurances: 2,
    attributes: {
      type: {
        path: ['type'],
        occurances: 2,
        sampleValue: 'type2',
        types: ['string']
      },
      parameter1: {
        path: ['parameter1'],
        occurances: 2,
        sampleValue: false,
        types: ['boolean', 'string']
      },
      parameter2: {
        path: ['parameter2'],
        occurances: 2,
        sampleValue: false,
        types: ['boolean']
      }
    }
  }]
}
```