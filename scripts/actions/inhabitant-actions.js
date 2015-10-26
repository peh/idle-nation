var keyMirror = require('keymirror')

export const InhabitantActions = keyMirror({
  ADD_INHABITANT: null,
  UPDATE_INHABITANT: null,
  INCREASE_INHABITANT: null,
  DECREASE_INHABITANT: null
})

export function addInhabitant(building) {
  return {
    type: InhabitantActions.ADD_INHABITANT,
    building
  }
}

export function updateInhabitant(building) {
  return {
    type: InhabitantActions.UPDATE_INHABITANT,
    building
  }
}

export function increaseInhabitantCount(type, amount) {
  let command = {
    type: type,
    amount: amount
  }
  return {
    type: InhabitantActions.INCREASE_INHABITANT,
    command
  }
}

export function decreaseInhabitantCount(type, amount) {
  let command = {
    type: type,
    amount: amount
  }
  return {
    type: InhabitantActions.DECREASE_INHABITANT,
    command
  }
}
