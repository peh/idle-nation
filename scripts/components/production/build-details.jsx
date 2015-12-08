import React from 'react'
import * as _ from 'lodash'
let swal = require('sweetalert')
let cx = require('classnames')

import * as INHABITANT_DATA from '../../data/inhabitant-data'
import * as MATERIAL_DATA from '../../data/material-data'
import House from '../../models/house'
import Building from '../../models/building'



export default class BuildDetails extends React.Component {
  render() {

    const {
      dispatch,
      building,
      materials,
      onWorkHere,
      me
    } = this.props

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
      costsRows.push(<dd className={amountClass} key={`costs-amount-${product.type}`}>{product.amount} ({material.amount})</dd>)
    })

    if(buildingType === 'Building'){
      _.each(building.getProduces(), (product) => {
        providesRows.push(<dt key={`provides-type-${product.type}`}>{product.type}</dt>)
        providesRows.push(<dd key={`provides-amount-${product.type}`}>{product.amount}</dd>)
      })

      if (building.amount > 0) {
        let workText = "Work Here"
        let iWorkHere = me && me.workplace && me.workplace.type === building.type
        let classes = cx("btn", "btn-secondary", {"btn-success": iWorkHere, "btn-default": !iWorkHere})
        if (iWorkHere) {
          workText = "You are working here"
        }
        workHereButton = (
          <button className={classes} onClick={() => {
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
        <div className="btn-group">
          <button className="btn btn-secondary" disabled={!building.canBuild(materials)} onClick={() => {
            building.build(dispatch, materials)
          }}>Build</button>
          <button className="btn btn-secondary" disabled={building.amount <= 0} onClick={() => {
            if(building.amount === 1) {
              swal({
                title: "Are you sure?",
                text: "This is your last Building of that kind. Selling it could leave you in a dead-end of the game (no wood and no lumberjack!)",
                type: "warning",
                showCancelButton: true,
                closeOnConfirm: true,
                html: false
              }, function(){
                building.sell(dispatch, materials)
              });
            } else {
              building.sell(dispatch, materials)
            }
          }}>Sell</button>
          {workHereButton}
        </div>
        <dl>
          <dt>Costs</dt>
          <dd>
            <dl className="dl-horizontal">
              {costsRows}
            </dl>
          </dd>
          <dt>{providesText}</dt>
          <dd>
            <dl className="dl-horizontal">
              {providesRows}
            </dl>
          </dd>
        </dl>
      </div>
    )
  }
}

BuildDetails.propTypes = {
  building: React.PropTypes.oneOfType([
      React.PropTypes.instanceOf(House),
      React.PropTypes.instanceOf(Building)
    ]),
  materials: React.PropTypes.array.isRequired,
  onWorkHere: React.PropTypes.func.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  me: React.PropTypes.object.isRequired,
};
