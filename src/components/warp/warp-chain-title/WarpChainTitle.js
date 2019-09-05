import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import classNames from 'classnames'
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Container, Row, Col } from 'react-bootstrap'
import 'Components/warp/warp-chain-title/warpChainTitle.scss'

export default class WarpChainTitle extends Component {
  constructor(props) {
    super(props)
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
    }
  }

  render() {
    return (
      <Card.Header className={this.state.styles.main}>
        <Container fluid>
          <Row>
            <Col xs="5" className={this.state.styles.asset}>
              <span className={this.state.styles.asset}>Stellar</span>
            </Col>
            <Col xs="2" className={this.state.styles.swap}>
              <FontAwesomeIcon icon={faExchangeAlt}></FontAwesomeIcon>
            </Col>
            <Col xs="5" className={this.state.styles.asset}>
              <span>Evry</span>
            </Col>
          </Row>
        </Container>
      </Card.Header>
    )
  }
}
