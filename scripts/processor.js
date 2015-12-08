import * as _ from 'lodash'
import {
  addMaterial,
  updateMaterial,
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
  changeSetting,
  updateLastTick
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
import * as BUILDING_DATA from './data/building-data.js'
import * as MATERIAL_DATA from './data/material-data.js'
import * as INHABITANT_DATA from './data/inhabitant-data.js'
import * as HOUSE_DATA from './data/house-data.js'
import * as GAME_DATA from './data/game-data.js'
import Material from './models/material'
export default class Processor {
  constructor(app) {
    this._tickInterval = -1
    this._autosaveInterval = -1
    this.app = app
    this._init()
  }

  _init() {

    let fromStore = this.app.dataStore.getAll()
    Immutable.fromJS(fromStore).forEach((v, k) => {
        let functionName = `_init_${k}`
        if (this[functionName] !== undefined) {
          this[functionName](v.toList().toJSON(), k)
        }
      })
    this._initApp(fromStore.app)
    // check that data for each buiding is present
    let currentBuildings = Immutable.fromJS(this.app.store.getState().buildings || {})
    let currentInhabitants = Immutable.fromJS(this.app.store.getState().inhabitants || {})
    let materials = Immutable.fromJS(this.app.store.getState().materials)
    _.each(MATERIAL_DATA, (material, type) => {
      if (type === 'default') {
        return
      }

      let fromCurrent = materials.find((i) => {
        return i.type === type
      })

      if (fromCurrent === undefined) {
        console.log(`${type} not found in save, creating`)
        this._dispatch(addMaterial(new Material(type, 0, 0)))
      }

    })

    _.each(INHABITANT_DATA, (inhabitant, type) => {
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

    _.each(BUILDING_DATA, (building, type) => {
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

  _initApp(data) {
    if(data.lastTick) {
      this._dispatch(updateLastTick(data.lastTick.lastTick))
    }
    _.each(data.settings, (v, k) => {
      this._dispatch(changeSetting(k, v))
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
    if (app.settings && app.settings.paused === true) {
      // although we are paused, we will still log ticks, otherwise we would FF after pause has ended
      this._dispatch(updateLastTick(new Date().getTime()))
      return
    }
    let lastTick = app.lastTick
    if(lastTick !== undefined) {
      lastTick = lastTick.lastTick
    }
    const now = new Date().getTime()
    if(now - lastTick > 2000){
      let fastForwarded = 0
      console.log("FastForwarding in time");
      while(now - lastTick > 2000) {
          this._tick()
          lastTick += 1000
          fastForwarded++
      }
      this._dispatch(changeSetting("fastForwarded", fastForwarded))
    } else {
      this._dispatch(changeSetting("fastForwarded", 0))
    }
    this._tick()
    // console.log(`lastTick: ${lastTick.lastTick}`)
    this._dispatch(updateLastTick(new Date().getTime()))
  }

  _tick() {
    let me = this._getState().me
    let buildings = this._getState().buildings
    let houses = this._getState().houses
    // create a clone of our material list that will be mutated by all the processing, and dispated again afterwards
    let noTicks = {}
    _.each(this._getState().materials, (material)=>{
      noTicks[material.type] = new Material(material.type, material.amount, 0)
    })


    let materials = Immutable.fromJS(noTicks)
    if(materials.size === 0){
      return
    }
    _.each(buildings, (building) => {
      if (building.amount > 0) {
        materials = building.produce(materials)
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

    // let some people die (and be born)! :D
    _.each(houseableInhabitants, (amount, type) => {
      let current = _.find(this._getState().inhabitants, (i) => {
        return i.type === type
      })
      this._dispatch(changeInhabitantCount(type, (amount-current.amount)))
    })

    let inhabitants = this._getState().inhabitants
    _.each(inhabitants, (inhabitant) => {
      materials = inhabitant.produce(materials)
    })

    // add stuff "Me" produces
    if (me && me.workplace) {
      let building = _.find(buildings, (b) => {
        return b.type === me.workplace.type
      })
      materials = building.produceSingle(materials, GAME_DATA.meFactor)
    }
    _.each(materials.toJSON(), (material) => {
      this._dispatch(updateMaterial(material))
    })
  }


  _produce(building, perTick) {
    let produced = {}
    _.each(building.getNeeds(), (material) => {
      this._dispatch(decreaseMaterial(material.type, material.amount))
      perTick[material.type] = (perTick[material.type] || 0) - material.amount
    })
    _.each(building.getProduces(), (material) => {
      produced[material.type] = (produced[material.type] || 0) + material.amount
      perTick[material.type] = (perTick[material.type] || 0) + material.amount
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
    this._run()
  }

  stop() {
    clearInterval(this._tickInterval)
    clearInterval(this._autosaveInterval)
  }
}
