
export function changeSetting(k, v) {
  let command = {key: k, value: v}
  return {
    type: 'CHANGE_SETTING',
    command
  }
}


export function changeRoute(route) {
  return {
    type: 'CHANGE_ROUTE',
    route
  }
}
