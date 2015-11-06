var keyMirror = require('keymirror')

export const HouseActions = keyMirror({
  ADD_HOUSE: null,
  CHANGE_HOUSE_COUNT: null,
})

export function addHouse(house) {
  return {
    type: HouseActions.ADD_HOUSE,
    house
  }
}

export function changeHouseCount(type, amount) {
  let command = {
    type: type,
    amount: amount
  }
  return {
    type: HouseActions.CHANGE_HOUSE_COUNT,
    command
  }
}
