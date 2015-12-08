import React from "react"
const cx = require('classnames')
import * as INHABITANT_DATA from '../../data/inhabitant-data'

export default class InhabitantRow extends React.Component {

  render() {

    let inhabitant = this.props.inhabitant
    let iconClasses = cx("icon", inhabitant.type)
    let data = INHABITANT_DATA[inhabitant.type]
     return (
       <tr>
         <td><span className={iconClasses}></span></td>
         <td>{data.name}</td>
         <td>{inhabitant.amount}</td>
       </tr>
    )
  }
}
