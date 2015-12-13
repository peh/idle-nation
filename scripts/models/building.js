const data = require("../data/building-data")
import {
  find, each, times
}
from 'lodash'
import * as GAME_DATA from '../data/game-data'
import {
  decreaseMaterial,
  increaseMaterial
}
from '../actions/material-actions'

import {
  changeBuildingCount
}
from '../actions/building-actions'

import Material from './material'

export default class Building {
  constructor(type, amount) {
    this.type = type
    this.amount = amount
    this._data = find(data, (d, type) => {
      return type === this.type
    })
  }

  isVisible(materials) {
    return this.amount > 0 || this.canBuild(materials)
  }

  getNeeds() {
    return this._data.needs || []
  }

  getProduces() {
    return this._data.produces || []
  }

  getCosts() {
    return this._data.costs || []
  }

  getInfo() {
    return this._data.info || ""
  }

  getName() {
    return this._data.name
  }

  canBuild(materials) {
    let result = true
    each(this.getCosts(), (cost) => {
      let material = find(materials, (m) => {
        return cost.type === m.type
      })
      if (!material || material.amount < cost.amount) {
        result = false
      }
    })
    return result
  }

  build(dispatch, materials) {
    if (this.canBuild(materials) === true) {
      each(this.getCosts(), (cost) => {
        dispatch(decreaseMaterial(cost.type, cost.amount))
      })
      dispatch(changeBuildingCount(this.type, 1))
    }
  }

  sell(dispatch) {
    if (this.amount > 0) {
      dispatch(changeBuildingCount(this.type, -1))
      each(this.getCosts(), (cost) => {
        dispatch(increaseMaterial(cost.type, (cost.amount * GAME_DATA.sellFactor)))
      })
    }
  }

  singleNeedsFullfilled(materials) {
    let result = true
    each(this.getNeeds(), (needed) => {
      if (!result) {
        // we already know that needs are not fullfilled, lets skip the rest
        return
      }
      let material = find(materials, (m) => {
        return m.type === needed.type
      })
      result = material && material.amount >= needed.amount
    })
    return result
  }

  produceSingle(materials, modFactor){
    let result = materials
    // first we update the ticks of needs
    each(this.getNeeds(), (mat) => {
      let material = materials.get(mat.type)
      result = result.set(mat.type, new Material(material.type, material.amount, material.perTick-mat.amount))
    })
    // now we do the actual amount update if needs are fullfilled
    if (this.singleNeedsFullfilled(result)) {
      each(this.getNeeds(), (mat) => {
        let material = result.get(mat.type)
        result = result.set(mat.type, new Material(material.type, material.amount-mat.amount, material.perTick))
      })
      each(this.getProduces(), (mat) => {
          let material = result.get(mat.type)
          let amount = mat.amount * modFactor
          result = result.set(mat.type, new Material(material.type, material.amount+amount, material.perTick+(amount)))
      })
    }
    return result
  }

  produce(materials, modFactor = 1) {
    let result = materials
    times(this.amount, () => {
      result = this.produceSingle(result, modFactor)
    })
    return result
  }

}
