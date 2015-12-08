import React from 'react'
import * as _ from 'lodash'
let cx = require('classnames')

import Link from '../common/link.jsx'
import BuildDetails from './build-details.jsx'

export default class Produdction extends React.Component {

  render() {
    const {
      navigate,
      build,
      sell,
      selectedBuilding,
      changeMeWork,
      dispatch,
      me,
      buildings,
      materials
    } = this.props

    // check what the selected building is
    let selected = null
    if (selectedBuilding !== undefined) {
      selected = _.find(buildings, (b) => {
        return b.type === selectedBuilding
      })
    }

    // change to list, if the selected should not be visible
    if (selected && !selected.isVisible(materials)) {
      navigate("/production")
      return (
        <div></div>
      )
    }

    let buildingRows = _.map(buildings, (building) => {
      let classes = cx("nav-link", "icon", building.type, {active: building.type === selectedBuilding, buildable: building.canBuild(materials)})
      let asterix = ""
      if (me && me.workplace && me.workplace.type === building.type) {
        asterix = "*"
      }
      if (building.isVisible(materials)) {
        return (
          <li className="nav-item" key={`building-type-${building.type}`}>
              <Link
                navigate={this.props.navigate}
                route={`/production/${building.type}`}
                className={classes}>
                {building.getName()} ({building.amount}){asterix}
              </Link>
          </li>

        )
      }
    })

    return (
      <div className="row-fluid">
        <div className="col-md-4">
          <ul className="nav nav-pills nav-stacked">
            {buildingRows}
          </ul>
        </div>
        <div className="col-md-8">
          <BuildDetails
            building={selected}
            materials={materials}
            onBuildButtonClicked={build}
            onSellButtonClicked={sell}
            onWorkHere={changeMeWork}
            me={me}
            dispatch={dispatch}
            />
        </div>
      </div>
    )
  }
}
