module.exports = {
  "beggar": {
    name: "Beggar",
    provided: 10,
    goldProduced: 0.01,
    needs: [
      {
        type: 'fish',
        amount: 0.1
      }
    ]
  },
  "peasent": {
    name: "Peasent",
    provided: 0,
    goldProduced: 0.1,
    needs: [
      {
        type: 'fish',
        amount: 0.5
      }
    ]
  }
}
