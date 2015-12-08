const DATA = require('../data/inhabitant-data')
import {
  find, times, each
}
from 'lodash'
import Material from './material'
export default class Inhabitant {
  constructor(type, amount) {
    this.amount = amount
    this.type = type
    this.data = find(DATA, (ignored, d) => {
      return d === type
    })
  }

  getName() {
    return this.data.name
  }

  getGoldProduced() {
    return this.data.goldProduced
  }

  getNeeds() {
    return this.data.needs
  }

  produce(materials) {
    let result = materials
    let gold = materials.get('gold')
    times(this.amount, () => {
      if (this.singleNeedsFullfilled(result)) {
        each(this.getNeeds(), (need) => {
          let material = result.get(need.type)
          result = result.set(need.type, new Material(material.type, material.amount-need.amount, material.perTick-need.amount))
        })
        gold = new Material('gold', gold.amount + this.getGoldProduced(), gold.perTick + this.getGoldProduced())
      }

    })
    result =result.set('gold', gold)
    return result
  }

  singleNeedsFullfilled(materials) {
    let result = true
    each(this.getNeeds(), (need) => {
      if (!result) {
        return
      }
      let material = materials.get(need.type)
      result = material && material.amount >= need.amount
    })
    return result
  }
}
