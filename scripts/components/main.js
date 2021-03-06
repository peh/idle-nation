import React, {
  Component,
  PropTypes
} from 'react';
import {connect} from 'react-redux';
import Navbar from "./navbar/navbar.jsx"
import Overview from "./overview/overview.jsx"
import Production from "./production/production.jsx"
import Housing from "./production/housing.jsx"
const pathToRegexp = require('path-to-regexp')
import * as _ from 'lodash'
import {changeSetting, appAlert} from '../actions/app-actions'
import {changeWorkplace} from '../actions/me-actions'
import ReactTooltip from 'react-tooltip'
const moment = require('moment')
const swal = require('sweetalert')
const cx = require('classnames')
import Modal from 'react-awesome-modal';

let Immutable = require('immutable')

class Main extends Component {

  constructor() {
    super()

    this.production = this.production.bind(this)
    this.housing = this.housing.bind(this)
    this.navigate = this.navigate.bind(this)
    this._changeMeWork = this._changeMeWork.bind(this)

    this.routes = {
      '/': this.production,
      '/production': this.production,
      '/production/:building': this.production,
      '/production/': this.production,
      '/housing': this.housing,
      '/housing/:building': this.housing,
      '/housing/': this.housing,
      404: this.production
    }

  }

  navigate(route){
    this.props.application.navigate(route)
  }

  production(building) {
    this.currentController = "production"
    let props = this.props
    return (
      <Production dispatch={this.props.dispatch} navigate={this.navigate} me={props.me} houses={props.houses} buildings={props.buildings} materials={props.materials} application={props.application} selectedBuilding={building} build={this._build} changeMeWork={this._changeMeWork}/>
    )
  }

  housing(building) {
    this.currentController = "housing"
    let props = this.props
    return (
      <Housing dispatch={this.props.dispatch} navigate={this.navigate} me={props.me} houses={props.houses} buildings={props.buildings} materials={props.materials} application={props.application} selectedBuilding={building} build={this._build} changeMeWork={this._changeMeWork}/>
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
      if (test !== null && test.length > max) {
        max = test.length
        best = f
        bestParams = test.slice(1)
      }
    })
    if (best === null) {
      return this.production(null)
    }
    if (bestParams && bestParams.length > 0) {
      return best(...bestParams)
    } else {
      return best()
    }
  }

  render() {
    const {dispatch, materials, app, application, route, inhabitants} = this.props;
    let content = this.parseRoute(route);
    let modal = ""
    if(app.settings && app.settings.fastForward > 0){
      let millisSince = new Date().getTime()-app.settings.fastForward
      let done = app.settings.fastForwardDone || 0
      modal = <Modal visible={true}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <h3>FastForwarding</h3>
              <span>Calculating progress since your last visit {moment(millisSince).fromNow()}.</span>
                <progress className="progress" value={done} max="10">{done}%</progress>
            </div>
          </div>
        </div>
      </Modal>
    }
    let alert = ""
    if(app.alert) {
      let appAlertClasses = cx('alert', 'alert-danger', 'app-alert', 'alert-dismissible', 'fade', 'in',{'invisible': !app.alert})
      alert = (<div className={appAlertClasses}>{app.alert.message}
        <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={()=>{
            dispatch(appAlert(null));
          }}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>)
    }

    return (
      <div>
        <Navbar navigate={this.navigate} currentController={this.currentController}
          app={app} materials={materials} onSave={(e) => {
            e.preventDefault();
            this.props
            .application
            .save()
            swal({
              title: "Saved!",
              type: 'success',
              timer: 5000
            });
        }} onPause={(e) => {
          e.preventDefault();
          let paused = true;
          if (app.settings && app.settings.paused !== undefined) {
            paused = !app.settings.paused
          }
          dispatch(changeSetting('paused', paused))
        }} onWipe={() => {
          swal({
            title: "Are you sure?",
            text: "Are you sure? This cannot be undone!",
            type: "warning",
            showCancelButton: true,
            closeOnConfirm: false
          }, function(){
            application.wipe()
            window.location.reload()
          });
        }}
        />
        <div className="container-fluid">
          {modal}
          <div className="row">
            <div className="col-md-3">
              <Overview materials={materials} inhabitants={inhabitants} navigate={this.navigate}/>
            </div>
            <div className="col-md-9">
                {content}
            </div>
          </div>
          <ReactTooltip/>
        </div>
        {alert}
      </div>
    )
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
    houses: convertToArray(state.houses),
    app: state.app,
    me: state.me,
    route: convertToArray(state.route)
  };
}

export default connect(select)(Main);
