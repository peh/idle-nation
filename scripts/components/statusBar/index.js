import React from "react"
import {map} from "lodash"

export default class StatusBar extends React.Component {

  render() {
    let items = map(this.props.inhabitants, (inhabitant) => {
      return (<div key={inhabitant.type}>{inhabitant.getName()}: {inhabitant.amount}</div>)
    })
    return (


      <div className="statusbar">
        {items}
      </div>
    )
  }
}
