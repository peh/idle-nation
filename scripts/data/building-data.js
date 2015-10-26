export default {
  "lumberjack": {
    provided: 1,
    name: "Lumberjack",
    produces: [{
      type: 'wood',
      amount: 0.1
    }],
    needs: [],
    costs: [{
      type: 'wood',
      amount: 50
    }]
  },
  "fisherman": {
    provided: 1,
    name: "Fisherman",
    produces: [{
      type: 'fish',
      amount: 0.1
    }],
    needs: [],
    costs: [{
      type: 'wood',
      amount: 50
    }]
  },
  "stonemason": {
    provided: 0,
    name: "Stonemason",
    produces: [{
      type: 'stone',
      amount: 0.05
    }],
    needs: [],
    costs: [{
      type: 'wood',
      amount: 150
    }]
  }
}
