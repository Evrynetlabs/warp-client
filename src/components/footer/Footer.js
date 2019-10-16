import React, { Component } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import classNames from 'classnames'
import { SvgLogoCopyright } from 'Components/logo'

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
        expand="lg"
        sticky="bottom"
        bg="light"
        className={this.state.styles.main}
      >
        <Navbar.Brand>
          <SvgLogoCopyright></SvgLogoCopyright>
        </Navbar.Brand>
      </Navbar>
    )
  }
}
