import React from "react"
import * as _ from 'lodash'
import * as gameData from '../../data/game-data'
let cx = require('classnames')

export default class Sidebar extends React.Component {

  _createRows(iterate){
    let rows = []
    _.each(iterate, (m)=>{

      let material = _.find(this.props.materials, (f)=>{
        return f.type === m
      })
      if(material && material.amount > 0){
        let classes = cx(material.type)
        rows.push(<li title={classes} className={material.type} key={`amount-${material.type}`}>{material.amount}</li>)
      }
    })
    return rows
  }

  render() {
    let pauseText = "Pause"
    if(this.props.app.settings && this.props.app.settings.paused === true) {
      pauseText = 'Continue'
    }
    let materialRows = this._createRows(gameData.materials)
    let foodRows = this._createRows(gameData.foods)
    return (
      <div className="sidebar">
        <div>
          <h4>Materials</h4>
          <ul className="materials">
            {materialRows}
          </ul>
        </div>
        <div>
          <h4>Food</h4>
          <ul className="food">
            {foodRows}
          </ul>
        </div>

        <ul>
          <li>github</li>
          <li><button onClick={this.props.onSave}>Save</button></li>
          <li><button onClick={this.props.onPause}>{pauseText}</button></li>
        </ul>
      </div>
    )
  }
}
