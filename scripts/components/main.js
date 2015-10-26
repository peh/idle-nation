import React, {
  Component,
  PropTypes
} from 'react';
import {connect} from 'react-redux';
import StatusBar from "./statusBar"
import Sidebar from "./sidebar"
import Overview from "./build/overview"
const pathToRegexp = require('path-to-regexp')
import * as _ from 'lodash'
import {changeSetting} from '../actions/app-actions'
import {increaseBuildingCount} from '../actions/building-actions'
import {decreaseMaterial} from '../actions/material-actions'
import {changeWorkplace} from '../actions/me-actions'
// import {increaseMaterial} from '../actions/material-actions'

let Immutable = require('immutable')

class Main extends Component {

  constructor() {
    super()

    this.buildingOverview = this.buildingOverview
      .bind(this)
    this._build = this._build
      .bind(this)
    this._changeMeWork = this._changeMeWork
      .bind(this)

    this.routes = {
      '/': this.buildingOverview,
      '/buildings/:building': this.buildingOverview,
      '/buildings/': this.buildingOverview,
      404: this.buildingOverview
    }

  }

  buildingOverview(building) {
    let props = this.props
    return (
      <Overview me={props.me} buildings={props.buildings} materials={props.materials} application={props.application} selectedBuilding={building} build={this._build} changeMeWork={this._changeMeWork}/>
    )
  }

  parseRoute(route) {
    let best = null
    let bestParams = []
    let max = 0
    _.each(this.routes, (f, r) => {

      let keys = []
      let re = pathToRegexp(r, keys)
      let test = re.exec(route)
      if (test && test.length > max) {
        max = test.length
        best = f
        bestParams = test.slice(1)
      }
    })
    if (best === null) {
      return this.buildingOverview(null)
    }
    if (bestParams && bestParams.length > 0) {
      return best(...bestParams)
    } else {
      return best()
    }
  }

  render() {
    const {dispatch, materials, buildings, inhabitants, app, me, application, route} = this.props;
    let content = this.parseRoute(route)
    return (
      <div className="container">
        <Sidebar app={app} materials={materials} onSave={() => {
          this.props
            .application
            .save()
        }} onPause={() => {
          let paused = true;
          if (app.settings && app.settings.paused !== undefined) {
            paused = !app.settings.paused
          }
          dispatch(changeSetting('paused', paused))
        }}/>
        <div className="content">
          <StatusBar materials={materials}/>
          <div className="content-container">
            {content}
          </div>
        </div>
      </div>

    )
  }

  _build(building) {
    if (building.canBuild(this.props.materials) === true) {
      _.each(building.getCosts(), (cost) => {
        this.props
          .dispatch(decreaseMaterial(cost.type, cost.amount))
      })
      this.props
        .dispatch(increaseBuildingCount(building.type, 1))
    }
  }

  _changeMeWork(building) {
    this.props.dispatch(changeWorkplace(building.type))
  }
}

Main.propTypes = {
  materials: PropTypes.array.isRequired,
  buildings: PropTypes.array.isRequired
};

function convertToArray(obj) {
  return Immutable.fromJS(obj)
    .toArray()
}

function select(state) {
  return {
    materials: convertToArray(state.materials),
    buildings: convertToArray(state.buildings),
    inhabitants: convertToArray(state.inhabitants),
    app: state.app,
    me: state.me,
    route: convertToArray(state.route)
  };
}

export default connect(select)(Main);
