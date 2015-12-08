var keyMirror = require('keymirror')

export const BuildingActions = keyMirror({
  ADD_BUILDING: null,
  UPDATE_BUILDING: null,
  CHANGE_BUILDING_COUNT: null,
  INCREASE_BUILDING: null,
  DESCREASE_BUILDING: null
})

export function addBuilding(building) {
  return {
    type: BuildingActions.ADD_BUILDING,
    building
  }
}

export function updateBuilding(building) {
  return {
    type: BuildingActions.UPDATE_BUILDING,
    building
  }
}

export function changeBuildingCount(type, amount) {
  let command = {
    type: type,
    amount: amount
  }
  return {
    type: BuildingActions.INCREASE_BUILDING,
    command
  }
}

export function increaseBuildingCount(type, amount) {
  let command = {
    type: type,
    amount: amount
  }
  return {
    type: BuildingActions.INCREASE_BUILDING,
    command
  }
}

export function decreaseBuildingCount(type, amount) {
  let command = {
    type: type,
    amount: amount
  }
  return {
    type: BuildingActions.DESCREASE_BUILDING,
    command
  }
}
