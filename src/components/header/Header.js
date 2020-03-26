import React, { Component } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import classNames from 'classnames'
import { ReactComponent as Logo } from '@/assets/icons/logo.svg'

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
        sticky="top"
        bg="light"
        className={this.state.styles.main}
      >
        <Navbar.Brand>
          <Logo></Logo>
        </Navbar.Brand>
      </Navbar>
    )
  }
}
