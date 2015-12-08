import React from 'react'
import * as _ from 'lodash'
let cx = require('classnames')

import Link from '../common/link.jsx'
import BuildDetails from './build-details.jsx'

export default class Housing extends React.Component {

  render() {
    const {
      navigate,
      build,
      sell,
      selectedBuilding,
      changeMeWork,
      dispatch,
      me,
      houses,
      materials
    } = this.props

    // check what the selected building is
    let selected = null
    if (selectedBuilding !== undefined) {
      selected = _.find(houses, (b) => {
        return b.type === selectedBuilding
      })
    }

    // change to list, if the selected should not be visible
    if (selected && !selected.isVisible(materials)) {
      navigate("/build")
      return (
        <div></div>
      )
    }

    let buildingRows = _.map(houses, (building) => {
      let classes = cx("icon", building.type, {active: building.type === selectedBuilding, buildable: building.canBuild(materials)})
      if (building.isVisible(materials)) {
        return (
          <Link key={`building-type-${building.type}`} navigate={this.props.navigate} route={`/housing/${building.type}`} className={classes}>{building.getName()} ({building.amount})</Link>
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
