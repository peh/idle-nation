import DataStore from './data-store.js'

const BASE_KEY = 'iN.data'

export default class LocalStoreDataStore extends DataStore {
  constructor(){
    super()
  }

  _init(){
    return JSON.parse(window.localStorage.getItem(BASE_KEY))
  }

  _persist(data) {
    window.localStorage.setItem(BASE_KEY, JSON.stringify(data))
  }

  _wipe() {
    window.localStorage.setItem(BASE_KEY, null)
  }

}
