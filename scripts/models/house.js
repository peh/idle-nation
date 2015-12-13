const DATA = require("../data/house-data")
import * as GAME_DATA from '../data/game-data'
import * as _ from 'lodash'

import {
  decreaseMaterial,
  increaseMaterial
}
from '../actions/material-actions'

import {
  changeHouseCount
}
from '../actions/house-actions'

export default class House {
  constructor(type, amount) {
    this.type = type
    this.amount = amount
    this.data = _.find(DATA, (ignored, d) => {
      return d === type
    })
  }

  isVisible(materials) {
    return this.amount > 0 || this.canBuild(materials)
  }

  getCosts() {
    return this.data.costs
  }

  getName() {
    return this.data.name
  }

  canBuild(materials) {
    let result = true
    _.each(this.getCosts(), (cost) => {
      let material = _.find(materials, (m) => {
        return cost.type === m.type
      })
      if (!material || material.amount < cost.amount) {
        result = false
      }
    })
    return result
  }

  getHosts() {
    return this.data.hosts
  }

  getInfo() {
    return this.data.info
  }

  build(dispatch, materials) {
    if (this.canBuild(materials) === true) {
      _.each(this.getCosts(), (cost) => {
        dispatch(decreaseMaterial(cost.type, cost.amount))
      })
      dispatch(changeHouseCount(this.type, 1))
    }
  }

  sell(dispatch) {
    if (this.amount > 0) {
      dispatch(changeHouseCount(this.type, -1))
      _.each(this.getCosts(), (cost) => {
        dispatch(increaseMaterial(cost.type, (cost.amount * GAME_DATA.sellFactor)))
      })
    }
  }
}
