import React from "react"

export default class Link extends React.Component {

  render () {

    return (
      <a className={this.props.className} href="#" onClick={(e) => {
        e.preventDefault();
        this.props.navigate(this.props.route)
      }}>
        {this.props.children}
      </a>
    )
  }
}

Link.propTypes = {
  className: React.PropTypes.string,
  navigate: React.PropTypes.func.isRequired,
  route: React.PropTypes.string.isRequired,
};
