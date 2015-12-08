import React from "react"
import ReactDOM from "react-dom"
import {Provider} from 'react-redux'
import Processor from './processor.js'
import LocalStoreDataStore from './dataStores/local-storage-data-store.js'
import Main from './components/main'
import {createStore} from 'redux';
import idleNationApp from './reducer';
import {changeRoute} from './actions/app-actions'
window.jQuery = require('jquery');
window.Tether = require('tether');
require('bootstrap')

class App {
  constructor() {
    this.store = createStore(idleNationApp)
    this.dataStore = new LocalStoreDataStore()
    this.processor = new Processor(this)
    this.onHistoryChange = this.onHistoryChange.bind(this)
    window.onpopstate = this.onHistoryChange
    this.onHistoryChange()
  }

  onHistoryChange() {
    let path = window.location.hash
    if(path.indexOf('#!') === 0) {
      path = path.substring(2)
    }
    this.store.dispatch(changeRoute(path))
  }

  navigate(path){
    let newPath = `!${path}`
    if (window.location.hash !== `#${newPath}`) {
      window.location.hash = newPath
      this.store.dispatch(changeRoute(path))
    }
  }

  wipe(){
    this.dataStore.wipe()
  }

  init() {
    this.processor.start()
  }

  dispatch(action) {
    this.store
    .dispatch(action)
  }

  save(){
    this.processor.save()
  }
}

const app = new App()
window.onload = () => {
  app.init()
  ReactDOM.render(<Provider store={app.store}><Main application={app}/></Provider>, document.getElementById('game-container'));
}
