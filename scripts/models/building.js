import * as data from "../data/building-data"
import * as _ from 'lodash'
export default class Building {
  constructor(type, amount) {
    this.type = type
    this.amount = amount
  }

  _getData(){
    return _.find(data, (d, type)=>{
      return type === this.type
    })
  }

  isVisible(materials){
    return this.amount > 0 || this.canBuild(materials)
  }

  getNeeds(){
    return this._getData().needs || []
  }

  getProduces(){
    return this._getData().produces || []
  }

  getCosts(){
    return this._getData().costs || []
  }

  getName(){
    return this._getData().name
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
}
