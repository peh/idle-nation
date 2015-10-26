var keyMirror = require('keymirror')

export const MaterialActions = keyMirror({
  ADD_MATERIAL: null,
  UPDATE_MATERIAL: null,
  INCREASE_MATERIAL: null,
  DECREASE_MATERIAL: null
})

export function addMaterial(material) {
  return {
    type: MaterialActions.ADD_MATERIAL,
    material
  }
}

export function updateMaterial(material) {
  return {
    type: MaterialActions.UPDATE_MATERIAL,
    material
  }
}

export function increaseMaterial(type, amount) {
  let command = {
    type: type,
    amount: amount
  }
  return {
    type: MaterialActions.INCREASE_MATERIAL,
    command
  }
}

export function decreaseMaterial(type, amount) {
  let command = {
    type: type,
    amount: amount
  }
  return {
    type: MaterialActions.DECREASE_MATERIAL,
    command
  }
}
