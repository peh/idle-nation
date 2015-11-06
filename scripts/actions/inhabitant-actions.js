var keyMirror = require('keymirror')

export const InhabitantActions = keyMirror({
  ADD_INHABITANT: null,
  CHANGE_INHABITANT_COUNT: null
})

export function addInhabitant(inhabitant) {
  return {
    type: InhabitantActions.ADD_INHABITANT,
    inhabitant
  }
}

export function changeInhabitantCount(type, amount) {
  let command = {
    type: type,
    amount: amount
  }
  return {
    type: InhabitantActions.CHANGE_INHABITANT_COUNT,
    command
  }
}
