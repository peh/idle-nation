import React from "react"
const cx = require('classnames')
import * as MATERIAL_DATA from '../../data/material-data'

export default class MaterialRow extends React.Component {

  render () {

    let material = this.props.material;
    let iconClasses = cx("icon", material.type);
    let rowClasses = cx({"table-danger": material.perTick < 0})
    let data = MATERIAL_DATA[material.type];

    return (
      <tr className={rowClasses}>
        <td>
          <span className={iconClasses}></span>
        </td>
        <td>{data.name}</td>
        <td>{material.amount}</td>
        <td>{material.perTick}/s</td>
      </tr>
    )
  }
}
