var keyMirror = require('keymirror')

export const MeActions = keyMirror({
  CHANGE_WORKPLACE: null
})

export function changeWorkplace(buildingType) {
  return {
    type: MeActions.CHANGE_WORKPLACE,
    buildingType
  }
}
