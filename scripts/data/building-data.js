module.exports = {
  "lumberjack": {
    provided: 1,
    name: "Lumberjack",
    info: "Lunberjacks chops wood. Wood is the most basic building material that you will need to enhance you Nation.",
    produces: [{
      type: 'wood',
      amount: 0.1
    }],
    needs: [],
    costs: [{
      type: 'wood',
      amount: 50
    }, {
      type: 'gold',
      amount: 10
    }]
  },
  "fisherman": {
    provided: 1,
    name: "Fisherman",
    info: "Fisherman fish! Fish is needed as basic food for your inhabitants.",
    produces: [{
      type: 'fish',
      amount: 1
    }],
    needs: [],
    costs: [{
      type: 'wood',
      amount: 100
    }, {
      type: 'gold',
      amount: 100
    }]
  },
  "stonemason": {
    provided: 0,
    name: "Stonemason",
    info: "Stonemasons shape rocks into Stones which are needed to build some more advanced buildings.",
    produces: [{
      type: 'stone',
      amount: 0.05
    }],
    needs: [],
    costs: [{
      type: 'wood',
      amount: 150
    }, {
      type: 'gold',
      amount: 250
    }]
  }
}
