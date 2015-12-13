import React from "react"
let cx = require('classnames')

export default class Icon extends React.Component {

  render () {
    let classes = cx("icon", this.props.icon, {"small": this.props.small, "big": this.props.large})

    return (
      <span className={classes}>{this.props.text || ""}</span>
    )
  }
}

Icon.propTypes = {
  icon: React.PropTypes.string.isRequired,
  text: React.PropTypes.string,
  large: React.PropTypes.bool,
  small: React.PropTypes.bool
};
