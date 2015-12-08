import React from "react"
import Tab from "./tab.jsx"
import {map} from "lodash"

const routes = [
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
    controller: 'science',
    route: "/science",
    text: 'Science'
  },
]

export default class Navbar extends React.Component {

  render () {
    let pauseText = "Pause";
    const {currentController, onSave, onPause, onReset, onWipe, app, navigate} = this.props;
    if (app.settings && app.settings.paused === true) {
      pauseText = 'Continue'
    }

    let tabs = map(routes, (route) => {
      return (
        <Tab navigate={navigate} key={`tab-${route.controller}`} currentController={currentController} route={route}/>
      )
    });
    return (
      <nav className="navbar navbar-light bg-faded">
        <a className="navbar-brand" href="#">IdleNation</a>
        <button className="navbar-toggler hidden-md-up" type="button" data-toggle="collapse" data-target="#navbar-collapse">
          &#9776;
        </button>
        <div className="collapse navbar-toggleable-md" id="navbar-collapse">
          <ul className="nav navbar-nav">
            {tabs}
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
