const DATA = require('../data/inhabitant-data')
import * as _ from 'lodash'
export default class Inhabitant {
  constructor(type, amount) {
    this.amount = amount
    this.type = type
    this.data = _.find(DATA, (ignored, d) => {
      return d === type
    })
  }

  getName(){
    return this.data.name
  }

  getGoldProduced(){
    return this.data.goldProduced
  }

  getNeeds() {
    return this.data.needs
  }
}
