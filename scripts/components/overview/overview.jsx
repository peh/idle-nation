import React from "react"
import {map, find} from "lodash"
import * as GAME_DATA from '../../data/game-data'
import MaterialRow from './material-row.jsx'
import InhabitantRow from './inhabitant-row.jsx'
export default class Overview extends React.Component {

  _createMaterialRows(iterate){
    return map(iterate, (m)=>{
      let material = find(this.props.materials, (f)=>{
        return f.type === m
      })
      if(material && (material.amount > 0 || material.perTick !== 0)){
        return (
          <MaterialRow key={`overview-row-${material.type}`} material={material} />
        )
      }
    })
  }

  _createInhabitantRows() {
    return map(this.props.inhabitants, (inhabitant) => {
      if(inhabitant.amount > 0){
        return (<InhabitantRow key={`overview-row-${inhabitant.type}`}inhabitant={inhabitant}/>)
      }
    })
  }

  render() {
    // const { inhabitants} = this.props

    let materialRows = this._createMaterialRows(GAME_DATA.materials)
    let foodRows = this._createMaterialRows(GAME_DATA.foods)
    let inhabitantRows = this._createInhabitantRows()
    return (
      <div className="overview">
        <table className="table table-sm">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Amount</th>
              <th>Production</th>
            </tr>
          </thead>
          <tbody>
            {materialRows}
            {foodRows}

          </tbody>
        </table>
        <h3>Inhabitants</h3>
        <table className="table table-sm">
          <tbody>
          {inhabitantRows}
          </tbody>
        </table>
      </div>
    )
  }
}
