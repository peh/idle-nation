export default class DataStore{
  constructor(){
    this._data = this._init() || {} // we dont want data to be null or even undefined
  }

  get(key){
    return this._data[key]
  }

  getAll(){
    return this._data
  }

  set(key, value){
    this._data[key] = value
  }

  persist(data){
    this._data = data
    this._persist(this._data)
  }
}
