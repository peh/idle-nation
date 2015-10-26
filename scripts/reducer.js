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
import Material from './models/material'
import Building from './models/building'
import Inhabitant from './models/inhabitant'
import Me from './models/me'
import Setting from './models/setting'
import * as Immutable from 'immutable'


function materialsReducer(action, materials = {}) {
  let newMaterials = Immutable.fromJS(materials).toMap()
  switch (action.type) {
    case MaterialActions.ADD_MATERIAL:
    case MaterialActions.UPDATE_MATERIAL:
      let md = action.material
      newMaterials = newMaterials.set(md.type, new Material(md.type, md.amount))
      break
    case MaterialActions.INCREASE_MATERIAL:
      let material = newMaterials.get(action.command.type)
      let newMaterial
      if (!material) {
        newMaterial = new Material(action.command.type, action.command.amount)
      } else {
        let newAmount = Math.round((material.amount + action.command.amount) * 100) / 100
        newMaterial = new Material(action.command.type, newAmount)
      }

      newMaterials = newMaterials.set(action.command.type, newMaterial)
      break
    case MaterialActions.DECREASE_MATERIAL:
      let fromStore = newMaterials.get(action.command.type)
      let newAmount = Math.round((fromStore.amount - action.command.amount) * 100) / 100
      newMaterials = newMaterials.set(action.command.type, new Material(fromStore.type, newAmount))
      break
  }
  return newMaterials.toJSON()
}

function buildingReducer(action, buildings = {}) {
  let newBuildings = Immutable.fromJS(buildings).toMap()
  switch (action.type) {
    case BuildingActions.ADD_BUILDING:
      let b = action.building
      newBuildings = newBuildings.set(b.type, new Building(b.type, b.amount))
      break
    case BuildingActions.INCREASE_BUILDING:
      let building = newBuildings.get(action.command.type)
      let newBuilding = new Building(action.command.type, ((building.amount || 0) + action.command.amount))
      newBuildings = newBuildings.set(action.command.type, newBuilding)
      break
  }
  return newBuildings.toJSON()
}

function inhabitantReducer(action, inhabitants = {}) {
  let map = Immutable.fromJS(inhabitants).toMap()
  switch (action.type) {
    case InhabitantActions.ADD_INHABITANT:
      let i = action.inhabitant
      map = map.set(i.type, new Inhabitant(i.type, i.amount))
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
    app: appReducer(action, state.app),
    route: routingReducer(action, state.route),
    me: meReducer(action, state.me)
  }
}

export default idleNationApp;
