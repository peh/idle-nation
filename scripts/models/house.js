const DATA = require("../data/house-data")
import * as _ from 'lodash'

export default class House {
  constructor(type, amount) {
    this.type = type
    this.amount = amount
    this.data = _.find(DATA, (ignored, d) => {
      return d === type
    })
  }

  isVisible(materials){
    return this.amount > 0 || this.canBuild(materials)
  }

  getCosts(){
    return this.data.costs
  }

  getName(){
    return this.data.name
  }

  canBuild(materials){
    let result = true
    _.each(this.getCosts(), (cost)=>{
      let material = _.find(materials, (m)=>{
        return cost.type === m.type
      })
      if(!material || material.amount < cost.amount) {
        result = false
      }
    })
    return result
  }

  getHosts(){
    return this.data.hosts
  }
}
