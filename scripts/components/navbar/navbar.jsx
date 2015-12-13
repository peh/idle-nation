import React from "react"
import Tab from "./tab.jsx"
import {map} from "lodash"
const cx = require('classnames')

const BUILD_ROUTES = [
  {
    controller: 'production',
    route: "/production",
    text: 'Production'
  },
  {
    controller: 'housing',
    route: "/housing",
    text: 'Housing'
  },
  {
    controller: 'service',
    route: "/service",
    text: 'Service'
  },
  {
    controller: 'science',
    route: "/science",
    text: 'Science'
  },
]

const MAIN_ROUTES = [
  {
    controller: 'research',
    route: "/research",
    text: 'Research'
  },
  {
    controller: 'nation',
    route: "/nation",
    text: 'Nation'
  },
]

export default class Navbar extends React.Component {

  render () {
    let pauseText = "Pause";
    const {currentController, onSave, onPause, onReset, onWipe, app, navigate} = this.props;
    if (app.settings && app.settings.paused === true) {
      pauseText = 'Continue'
    }

    let isBuildController = false;
    let buildRows = map(BUILD_ROUTES, (route) => {
      if(!isBuildController) {
        isBuildController = route.controller === currentController;
      }
      return (
        <NavLink key={`dd-item-${route.route}`} navigate={navigate} currentController={currentController} route={route} />
      )
    });

    let ddClasses = cx('nav-item', 'dropdown', {'active': isBuildController});
    let mainRows = map(MAIN_ROUTES, (route) => {
      return (
        <Tab key={`dd-item-${route.route}`} navigate={navigate} currentController={currentController} route={route} />
      )
    });
    return (
      <nav className="navbar navbar-dark bg-inverse">
        <a className="navbar-brand" href="#">IdleNation</a>
        <div className="collapse navbar-toggleable-md" id="navbar-collapse">
          <ul className="nav navbar-nav">
            <li className={ddClasses}>
              <a className="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Build</a>
              <div className="dropdown-menu">
                {buildRows}
              </div>
            </li>
            {mainRows}
          </ul>
          <ul className="nav navbar-nav pull-right">
            <li className="nav-item">
              <a href="#" className="nav-link" onClick={onSave}>
                Save
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link" onClick={onPause}>
                {pauseText}
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link" onClick={onReset}>
                Reset
              </a>
            </li>
            <li className="nav-item">
              <a href="https://github.com/peh/idle-nation" className="nav-link">
                About <i className="fa fa-github"></i>
              </a>
            </li>
            <li className="nav-item danger">
              <a href="#" className="nav-link" onClick={onWipe}>
                Wipe
              </a>
            </li>
          </ul>
        </div>
      </nav>
    )
  }
}

class NavLink extends React.Component {
  render() {
    const {currentController, navigate, route } = this.props;
    let classes = cx('dropdown-item', {
      active: route.controller === currentController
    });
    return <a href="#" className={classes} onClick={(e) => {
      e.preventDefault();
      navigate(route.route)
    }}>
      {route.text}
    </a>
  }
}
