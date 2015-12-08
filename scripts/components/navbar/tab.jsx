import React from "react"
const cx = require('classnames')
export default class Tab extends React.Component {

  render () {
    const {currentController, route, navigate} = this.props;
    let classes = cx('nav-item', {
      active: route.controller === currentController
    });

    return (
      <li className={classes}>
        <a href="#" className='nav-link' onClick={(e) => {
          e.preventDefault();
          navigate(route.route)
        }}>
          {route.text}
        </a>
      </li>
    )
  }
}
