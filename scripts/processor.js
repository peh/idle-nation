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
  addInhabitant,
  changeInhabitantCount
}
from './actions/inhabitant-actions'
import {
  changeSetting
}
from './actions/app-actions'
import {
  changeWorkplace
}
from './actions/me-actions'
import {
  addHouse
}
from './actions/house-actions'

import * as Immutable from 'immutable'
import * as BuildingData from './data/building-data.js'
import * as InhabitantData from './data/inhabitant-data.js'
import * as HOUSE_DATA from './data/house-data.js'
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
    let currentInhabitants = Immutable.fromJS(this.app.store.getState().inhabitants || {})
    _.each(InhabitantData, (inhabitant, type) => {
      if (type === 'default') {
        return
      }


      let fromCurrent = currentInhabitants.find((i) => {
        return i.type === type
      })

      if (fromCurrent === undefined) {
        console.log(`${type} not found in save, creating`)
        this._dispatch(addInhabitant({
          type: type,
          amount: inhabitant.provided
        }))
      }

    })

    _.each(BuildingData, (building, type) => {
      if (type === 'default') {
        return
      }

      let fromCurrent = currentBuildings.find((b) => {
        return b.type === type
      })

      if (fromCurrent === undefined) {
        // we need to add it
        console.log(`${type} not found in save, creating`)
        this._dispatch(addBuilding({
          type: type,
          amount: building.provided
        }))
      }

    })

    _.each(HOUSE_DATA, (house, type) => {
      if (type === 'default') {
        return
      }

      if (_.find(this._getState().houses, (h) => {
          return h.type === type
        }) === undefined) {
        console.log(`${type} not found in save, creating`)
        this._dispatch(addHouse({
          type: type,
          amount: house.provided
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

  _init_inhabitants(data) {
    this._initGenericList(data, addInhabitant)
  }

  _init_houses(data) {
    this._initGenericList(data, addHouse)
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

  _initGenericList(data, dispatchable) {
    _.each(data, (i) => {
      this._dispatch(dispatchable(i))
    })
  }

  _run() {
    let app = this._getState().app
    let me = this._getState().me
    if (app.settings && app.settings.paused === true) {
      return
    }
    let productsProduced = {
      gold: 0
    }
    let buildings = this._getState().buildings
    let houses = this._getState().houses
    _.each(buildings, (building) => {
      if (building.amount > 0) {
        for (var i = 0; i < building.amount; i++) {
          if (this._checkNeeds(building)) {
            _.each(this._produce(building), (amount, produced) => {
              this._dispatch(increaseMaterial(produced, amount))
              productsProduced[produced] = (productsProduced[produced] || 0) + amount
            })
          }
        }
      }
    })

    // check houses and inhabitants
    let houseableInhabitants = {}
    _.each(houses, (house) => {
      _.each(house.getHosts(), (d) => {
        let amount = d.amount * house.amount
        if (houseableInhabitants[d.type] === undefined) {
          houseableInhabitants[d.type] = amount
        } else {
          houseableInhabitants[d.type] += amount
        }
      })
    })

    // let some people die! :D
    _.each(houseableInhabitants, (amount, type) => {
      let current = _.find(this._getState().inhabitants, (i) => {
        return i.type === type
      })
      if(!current && amount > 0){
        // looks like we need to create some
        this._dispatch(addInhabitant(type, amount))
      } else if(current && amount != current.amount){
        // this could be both, breeding or dying
        this._dispatch(changeInhabitantCount(type, (amount-current.amount)))
      }
    })

    let inhabitants = this._getState().inhabitants
    _.each(inhabitants, (inhabitant) => {
        _.times(inhabitant.amount, () => {
          if (this._checkNeeds(inhabitant)) {
            _.each(inhabitant.getNeeds(), (need) => {
              this._dispatch(decreaseMaterial(need.type, need.amount))
            })
            this._dispatch(increaseMaterial('gold', inhabitant.getGoldProduced()))
            productsProduced.gold += inhabitant.getGoldProduced()
          }
        })
      })
      // add stuff "Me" produces
    if (me && me.workplace) {
      let building = _.find(buildings, (b) => {
        return b.type === me.workplace.type
      })
      if (building && this._checkNeeds(building)) {
        _.each(this._produce(building), (amount, produced) => {
          this._dispatch(increaseMaterial(produced, amount * 10))
            // "Me" produces 10 times more
            // amount = amount * 10
            // productsProduced[produced] = (productsProduced[produced] || 0) + amount
        })
      }
    }
    // dispatch all the produced products
    // _.each(productsProduced, (amount, type) => {
    // this._dispatch(increaseMaterial(type, amount))
    // })

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

  _checkNeeds(hasNeeds) {
    let result = true
    _.each(hasNeeds.getNeeds(), (needed) => {
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
    return this._getState().materials
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
