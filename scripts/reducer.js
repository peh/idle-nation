import {
  MaterialActions
}
from './actions/material-actions'
import {
  BuildingActions
}
from './actions/building-actions'
import {
  InhabitantActions
}
from './actions/inhabitant-actions'
import {
  MeActions
}
from './actions/me-actions'
import {
  HouseActions
}
from './actions/house-actions'
import Material from './models/material'
import Building from './models/building'
import House from './models/house'
import Inhabitant from './models/inhabitant'
import Me from './models/me'
import Setting from './models/setting'
import * as Immutable from 'immutable'

function round(num) {
  return Math.round(num * 10000) / 10000
}

function materialsReducer(action, materials = {}) {
  let result = Immutable.fromJS(materials).toMap()
  switch (action.type) {
    case MaterialActions.ADD_MATERIAL:
      let md = action.material
      result = result.set(md.type, new Material(md.type, round(md.amount), round(md.perTick)))
      break
    case MaterialActions.UPDATE_MATERIAL:
      let toUpdate = action.material
      result = result.set(toUpdate.type, new Material(toUpdate.type, round(toUpdate.amount), round(toUpdate.perTick)))
      break
    case MaterialActions.UPDATE_TICK:
      let cmd = action.command
      result = result.set(cmd.type, new Material(cmd.type, result.get(cmd.type).amount, round(cmd.tick)))
      break
    case MaterialActions.CHANGE_MATERIAL_AMOUNT:
      let known = result.get(action.command.type)
      let tick = 0
      let newAmount = 0
        // debugger
      if (known && known.amount) {
        newAmount = known.amount + action.command.amount
        tick = known.tick // we don't want to update the "tick" value
      } else {
        newAmount = action.command.amount
      }
      result = result.set(action.command.type, new Material(action.command.type, Math.round((newAmount) * 10000) / 10000, tick))
      break
  }
  return result.toJSON()
}

function buildingReducer(action, buildings = {}) {
  let newBuildings = Immutable.fromJS(buildings).toMap()
  switch (action.type) {
    case BuildingActions.ADD_BUILDING:
      let b = action.building
      newBuildings = newBuildings.set(b.type, new Building(b.type, b.amount))
      break
    case BuildingActions.INCREASE_BUILDING:
      let known = newBuildings.get(action.command.type)
      let building = new Building(action.command.type, ((known.amount || 0) + action.command.amount))
      newBuildings = newBuildings.set(action.command.type, building)
      break
  }
  return newBuildings.toJSON()
}

function houseReducer(action, houses = {}) {
  let result = Immutable.fromJS(houses).toMap()
  switch (action.type) {
    case HouseActions.ADD_HOUSE:
      let data = action.house
      result = result.set(data.type, new House(data.type, data.amount))
      break
    case HouseActions.CHANGE_HOUSE_COUNT:
      let type = action.command.type
      let change = action.command.amount
      let current = result.get(action.command.type)
      let house = new House(type, (current.amount + change))
      result = result.set(type, house)
      break
  }
  return result.toJSON()
}

function inhabitantReducer(action, inhabitants = {}) {
  let map = Immutable.fromJS(inhabitants).toMap()
  switch (action.type) {
    case InhabitantActions.ADD_INHABITANT:
      let i = action.inhabitant
      map = map.set(i.type, new Inhabitant(i.type, i.amount))
      break
    case InhabitantActions.CHANGE_INHABITANT_COUNT:
      let type = action.command.type
      let change = action.command.amount
      let current = map.get(action.command.type)
      let inhabitant = new Inhabitant(type, (current.amount + change))
      map = map.set(type, inhabitant)
      break
  }
  return map.toJSON()
}

function meReducer(action, me = {}) {
  let meMap = Immutable.fromJS(me).toMap()
  switch (action.type) {
    case MeActions.CHANGE_WORKPLACE:
      let meMap = meMap.set('workplace', {
        type: action.buildingType
      })
      break
  }
  return meMap.toJSON()
}

function appReducer(action, appState = {}) {
  let newState = Immutable.fromJS(appState).toMap()
  if (action.type === 'CHANGE_SETTING') {
    let settings = newState.get('settings')
    if (!settings) {
      settings = Immutable.Map()
    } else {
      settings = Immutable.fromJS(settings).toMap()
    }
    settings = settings.set(action.command.key, action.command.value)
    newState = newState.set('settings', settings)
  } else if(action.type === 'UPDATE_LAST_TICK') {
    newState = newState.set('lastTick', {lastTick: action.command.lastTick})
  }
  return newState.toJSON()
}

function routingReducer(action, route = {}) {
  let newRoute = Immutable.fromJS(route).toMap()
  if (action.type === "CHANGE_ROUTE") {
    newRoute = newRoute.set("path", action.route)
  }
  return newRoute.toJSON()
}

const idleNationApp = function(state = {}, action) {
  return {
    materials: materialsReducer(action, state.materials),
    buildings: buildingReducer(action, state.buildings),
    inhabitants: inhabitantReducer(action, state.inhabitants),
    houses: houseReducer(action, state.houses),
    app: appReducer(action, state.app),
    route: routingReducer(action, state.route),
    me: meReducer(action, state.me)
  }
}

export default idleNationApp;
