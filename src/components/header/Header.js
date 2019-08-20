import React, { Component } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import classNames from 'classnames'

export default class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      styles: {
        main: classNames({
          [this.constructor.name]: true,
        }),
      },
    }
  }

  render() {
    return (
      <Navbar
        bg="dark"
        expand="true"
        sticky="top"
        className={this.state.styles.main}
        variant="dark"
      >
        <Navbar.Brand>EV^RYNET</Navbar.Brand>
      </Navbar>
    )
  }
}
