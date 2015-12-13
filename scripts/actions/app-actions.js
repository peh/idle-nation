
export function changeSetting(k, v) {
  let command = {key: k, value: v}
  return {
    type: 'CHANGE_SETTING',
    command
  }
}


export function updateLastTick(lastTick) {
  let command = {lastTick: lastTick}
  return {
    type: 'UPDATE_LAST_TICK',
    command
  }
}

export function changeRoute(route) {
  return {
    type: 'CHANGE_ROUTE',
    route
  }
}

export function appAlert(message) {
  let command = {message: message}
  return {
    type: 'ALERT',
    command
  }
}
