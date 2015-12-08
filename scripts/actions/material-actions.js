var keyMirror = require('keymirror')

export const MaterialActions = keyMirror({
  ADD_MATERIAL: null,
  UPDATE_MATERIAL: null,
  UPDATE_TICK: null,
  CHANGE_MATERIAL_AMOUNT: null
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

export function updateTick(type, tick) {
  let cmd = {
    type: type,
    tick: tick
  }
  return {
    type: MaterialActions.UPDATE_TICK,
    command: cmd
  }
}

export function increaseMaterial(type, amount) {
  let command = {
    type: type,
    amount: amount
  }
  return {
    type: MaterialActions.CHANGE_MATERIAL_AMOUNT,
    command
  }
}

export function decreaseMaterial(type, amount) {
  let command = {
    type: type,
    amount: -amount
  }
  return {
    type: MaterialActions.CHANGE_MATERIAL_AMOUNT,
    command
  }
}
