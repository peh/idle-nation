import * as _ from 'lodash'
import {
  addMaterial,
  increaseMaterial,
  decreaseMaterial
}
from './actions/material-actions'

import {
  addBuilding
}
from './actions/building-actions'

import {
  changeSetting
}
from './actions/app-actions'
import {
  changeWorkplace
}
from './actions/me-actions'

import * as Immutable from 'immutable'
import * as BuildingData from './data/building-data.js'

export default class Processor {
  constructor(app) {
    this._tickInterval = -1
    this._autosaveInterval = -1
    this.app = app

    this._init()
      // this.app.dataStore.persist()
  }

  _init() {

    Immutable.fromJS(this.app.dataStore.getAll()).forEach((v, k) => {
        let functionName = `_init_${k}`
        if (this[functionName] !== undefined) {
          this[functionName](v.toList().toJSON(), k)
        }
      })
      // check that data for each buiding is present
    let currentBuildings = Immutable.fromJS(this.app.store.getState().buildings || {})
    Immutable.fromJS(BuildingData).forEach((building, type) => {
      if (type === 'default') {
        return
      }

      let fromCurrent = currentBuildings.find((b) => {

        return b.type === type
      })

      if (fromCurrent === undefined) {
        // we need to add it
        console.log(`${type} not found in save, creating`)
        let b = building.toJSON()
        this._dispatch(addBuilding({
          type: type,
          amount: b.provided
        }))
      }

    })

  }

  _dispatch(action) {
    this.app.store.dispatch(action)
  }

  _init_materials(data) {
    _.each(data, (material) => {
      this._dispatch(addMaterial(material))
    })
  }

  _init_buildings(data) {
    _.each(data, (building) => {
      this._dispatch(addBuilding(building))
    })
  }

  _init_app(data) {
    _.each(data, (setting) => {
      _.each(setting, (v, k) => {
        this._dispatch(changeSetting(k, v))
      })
    })
  }

  _init_me(data) {
    // TODO: refactor to not only be able to handle workplace but more stuff we might store in "Me"
    if (data && data.length > 0) {
      this._dispatch(changeWorkplace(data[0].type))
    }
  }

  _run() {
    let app = this._getState().app
    let me = this._getState().me
    if (app.settings && app.settings.paused === true) {
      return
    }
    let products = {}
    let buildings = this._getState().buildings
    _.each(buildings, (building) => {
        if (building.amount > 0) {
          for (var i = 0; i < building.amount; i++) {
            if (this._checkNeeds(building)) {
              _.each(this._produce(building), (amount, produced) => {
                products[produced] = (products[produced] || 0) + amount
              })
            }
          }
        }
      })
      // add stuff "Me" produces
    if (me && me.workplace) {
      let building = _.find(buildings, (b) => {
        return b.type === me.workplace.type
      })
      if (building && this._checkNeeds(building)) {
        _.each(this._produce(building), (amount, produced) => {
          // "Me" produces 10 times more
          amount = amount * 10
          products[produced] = (products[produced] || 0) + amount
        })
      }
    }
    // dispatch all the produced products
    _.each(products, (amount, type) => {
      this._dispatch(increaseMaterial(type, amount))
    })

  }


  _produce(building) {
    let produced = {}
    _.each(building.getNeeds(), (material) => {
      this._dispatch(decreaseMaterial(material.type, material.amount))
    })
    _.each(building.getProduces(), (material) => {
      produced[material.type] = (produced[material.type] || 0) + material.amount
    })
    return produced
  }

  _checkNeeds(building) {
    let result = true
    _.each(building.needs, (needed) => {
      let material = _.find(this._getMaterials(), (m) => {
        return m.type === needed.type
      })
      if (!material || material.amount < needed.amount) {
        result = false
      }
    })
    return result
  }

  _getState() {
    return this.app.store.getState()
  }

  _getMaterials() {
    return this._getState().material
  }

  save() {
    let app = this.app.store.getState().app
    if (app.settings && app.settings.paused === true) {
      return
    }
    this.app.dataStore.persist(this.app.store.getState())
  }

  start() {
    this._tickInterval = setInterval(() => {
      this._run()
    }, 1000)
    this._autosaveInterval = setInterval(() => {
      this.save()
    }, 5000)
  }

  stop() {
    clearInterval(this._tickInterval)
    clearInterval(this._autosaveInterval)
  }
}
