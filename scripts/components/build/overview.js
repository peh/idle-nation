import React from 'react'
import * as _ from 'lodash'
import * as gameData from '../../data/game-data'
let cx = require('classnames')

import * as INHABITANT_DATA from '../../data/inhabitant-data'
import * as MATERIAL_DATA from '../../data/material-data'

export default class Overview extends React.Component {

  _navigate(building) {
    if (building) {
      this.props
        .application
        .navigate(`/buildings/${building.type}`)
    } else {
      this.props
        .application
        .navigate(`/buildings`)
    }

  }

  render() {
    const {me, selectedBuilding, materials, build, changeMeWork, houses, buildings} = this.props

    // check what the selected building is
    let selected = ""
    if (selectedBuilding !== undefined) {
      selected = _.find(buildings, (b) => {
        return b.type === this.props.selectedBuilding
      })
      if(!selected){
        selected = _.find(houses, (b) => {
          return b.type === this.props.selectedBuilding
        })
      }
    }

    // change to list, if the selected should not be visible
    if (selected && !selected.isVisible(this.props.materials)) {
      this._navigate(null)
      return (
        <div></div>
      )
    }

    let rows = []
    _.each(houses, (house)=>{
      if (house.isVisible(this.props.materials)) {
        rows.push(<Row me={me} key={house.type} building={house} onRowClicked={(b) => {
          this._navigate(b)
        }}/>)
      }
    })
    _.each(buildings, (building) => {
      if (building.isVisible(this.props.materials)) {
        rows.push(<Row me={me} key={building.type} building={building} onRowClicked={(b) => {
          this._navigate(b)
        }}/>)
      }
    })

    return (
      <div className="build-overview">
        <div className="list">
          <div>{rows}</div>
        </div>
        <InfoView me={me} building={selected} materials={materials} onBuildButtonClicked={build} onWorkHere={changeMeWork}/>
      </div>

    )
  }
}

class InfoView extends React.Component {
  render() {
    let building = this.props.building

    const {onBuildButtonClicked, materials, onWorkHere, me} = this.props
    if (!building) {
      return (
        <div className="info">Select a Building from the list</div>
      )
    }
    let buildingType = building.constructor.name
    let headerClasses = cx(building.type, "big-icon")

    let providesRows = []
    let costsRows = []
    let workHereButton = (<div></div>)
    let providesText = ""
    _.each(building.getCosts(), (product)=>{
      let data = MATERIAL_DATA[product.type]
      let material = _.find(materials, (m) => {
        return m.type === product.type
      })
      let typeClass = cx("small-icon", product.type)
      let amountClass = cx({danger: material.amount < product.amount})

      costsRows.push(<dt className={typeClass} key={`costs-type-${product.type}`}>{data.name}</dt>)
      costsRows.push(<dd data-tip={material.amount} className={amountClass} key={`costs-amount-${product.type}`}>{product.amount}</dd>)
    })

    if(buildingType === 'Building'){
      _.each(building.getProduces(), (product) => {
        providesRows.push(<dt key={`provides-type-${product.type}`}>{product.type}</dt>)
        providesRows.push(<dd key={`provides-amount-${product.type}`}>{product.amount}</dd>)
      })

      if (building.amount > 0) {
        let workText = "Work Here"
        if (me && me.workplace && me.workplace.type === building.type) {
          workText = "You work here"
        }
        workHereButton = (
          <button onClick={() => {
            onWorkHere(building)
          }}>{workText}</button>
        )
      }
    } else {
      providesText = "Hosts"
      _.each(building.getHosts(), (host) => {
        let d = INHABITANT_DATA[host.type]
        if(d !== undefined) {
          providesRows.push(<dt key={`hosts-type-${host.type}`}>{d.name}</dt>)
          providesRows.push(<dd key={`hosts-amount-${host.type}`}>{host.amount}</dd>)
        }
      })
    }

    return (
      <div className="info">
        <h3 className={headerClasses}>{building.getName()}</h3>
        <button disabled={!building.canBuild(materials)} onClick={() => {
          onBuildButtonClicked(building)
        }}>Build</button>
        {workHereButton}
        <dl>
          <dt>Costs</dt>
          <dd>
            <dl className="horizontal">
              {costsRows}
            </dl>
          </dd>
          <dt>{providesText}</dt>
          <dd>
            <dl className="horizontal">
              {providesRows}
            </dl>
          </dd>
        </dl>
      </div>
    )
  }
}

class Row extends React.Component {
  render() {
    const {building, me} = this.props

    let workHere = ""
    if (me && me.workplace && me.workplace.type === building.type) {
      workHere = (
        <span>&nbsp;*</span>
      )
    }
    let classes = cx('list-row', building.type)
    return (
      <div className="list-row" onClick={() => {
        this.props
          .onRowClicked(building)
      }}>
        {building.getName()}
        &nbsp;({building.amount})
        {workHere}
      </div>
    )
  }
}
