var keyMirror = require('keymirror')

export const BuildingActions = keyMirror({
  ADD_BUILDING: null,
  UPDATE_BUILDING: null,
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
