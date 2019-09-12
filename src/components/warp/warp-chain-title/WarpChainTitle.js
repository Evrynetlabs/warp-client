import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import classNames from 'classnames'
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Container, Row, Col } from 'react-bootstrap'
import PropTypes from 'prop-types'
import 'Components/warp/warp-chain-title/warpChainTitle.scss'

export default class WarpChainTitle extends Component {
  constructor(props) {
    super(props)
    const chain = {
      EVRY: 'Evrynet',
      XLM: 'Stellar',
    }
    this.stylesMain = classNames({
      [this.constructor.name]: true,
    })
    this.stylesAssetElem = `${this.stylesMain}__asset`
    this.stylesSwapElem = `${this.stylesMain}__swap`
    this.state = {
      styles: {
        main: this.stylesMain,
        asset: this.stylesAssetElem,
        swap: this.stylesSwapElem,
      },
      chain: chain,
      swap: {
        src: chain.XLM,
        dest: chain.EVRY,
      },
    }
  }

  _updateSwapTitle(prevProps) {
    if (prevProps.isToEvry === this.props.isToEvry) return
    if (this.props.isToEvry) {
      this.setState({
        swap: {
          src: this.state.chain.XLM,
          dest: this.state.chain.EVRY,
        },
      })
      return
    }
    this.setState({
      swap: {
        src: this.state.chain.EVRY,
        dest: this.state.chain.XLM,
      },
    })
  }

  componentDidUpdate(prevProps) {
    this._updateSwapTitle(prevProps)
  }

  render() {
    return (
      <Card.Header className={this.state.styles.main}>
        <Container fluid>
          <Row>
            <Col xs="5" className={this.state.styles.asset}>
              <span className={this.state.styles.asset}>
                {this.state.swap.src}
              </span>
            </Col>
            <Col
              xs="2"
              className={this.state.styles.swap}
              onClick={() => {
                this.props.toggleTransferSwitch()
              }}
            >
              <FontAwesomeIcon icon={faExchangeAlt}></FontAwesomeIcon>
            </Col>
            <Col xs="5" className={this.state.styles.asset}>
              <span>{this.state.swap.dest}</span>
            </Col>
          </Row>
        </Container>
      </Card.Header>
    )
  }
}

WarpChainTitle.propTypes = {
  isToEvry: PropTypes.bool.isRequired,
  toggleTransferSwitch: PropTypes.func.isRequired,
}
