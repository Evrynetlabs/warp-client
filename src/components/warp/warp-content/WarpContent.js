import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import classNames from 'classnames'
import { Container, Row, Col, Button, Form } from 'react-bootstrap'
import 'Components/warp/warp-content/warpContent.scss'
import { numberToCurrencyString, currencyToNumberString } from '@/utils/format'
import PropTypes from 'prop-types'
export default class WarpContent extends Component {
  constructor(props) {
    super(props)
    this.initialState = {
      styles: this._initStyles(),
      amount: '',
      asset: 'EVRY',
      role: {
        source: 'source',
        destination: 'destination',
      },
      sourceAccount: '',
      destinationAccount: '',
    }
    this.state = {
      ...this.initialState,
    }
  }

  _initStyles() {
    const stylesMain = classNames({
      [this.constructor.name]: true,
    })
    const stylesFooter = `${stylesMain}__footer`
    const stylesContent = `${stylesMain}__content`
    const stylesContentAmountSelection = `${stylesContent}__amount`
    const stylesFooterButton = `${stylesFooter}__btn`
    return {
      main: stylesMain,
      content: stylesContent,
      footer: stylesFooter,
      footerBtn: stylesFooterButton,
      amountSelection: stylesContentAmountSelection,
    }
  }

  _toAmountString() {
    return currencyToNumberString(this.state.amount)
  }

  _formatNumber(amount) {
    this.setState({
      amount: numberToCurrencyString(Number(currencyToNumberString(amount))),
    })
  }

  _saveAmount(e) {
    this.setState({
      amount: e.target.value,
    })
  }

  _saveAsset(e) {
    this.setState({
      asset: e.target.value,
    })
  }

  _saveTransactionAccount(e, role = '') {
    this.setState({
      ...(this.state.role.source === role && { sourceAccount: e.target.value }),
      ...(this.state.role.destination === role && {
        destinationAccount: e.target.value,
      }),
    })
  }

  async _handleSubmit(e) {
    e.preventDefault()
    let asset
    switch (this.asset) {
      case 'EVRY': {
        asset = {} //this.warp.getEvryAsset()
        break
      }
      case 'XLM': {
        asset = {} //this.warp.getStellarAsset()
        break
      }
    }
    await this.toEvry({
      asset,
      amount: this.state.amount,
      srcStellarSecret: this.state.sourceAccount,
      destEvryAddr: this.state.destinationAccount,
    })
  }

  render() {
    return (
      <Form
        onSubmit={async (e) => {
          await this._handleSubmit(e)
        }}
      >
        <Card.Body className={this.state.styles.content}>
          <Container fluid>
            <Row>
              <Col>
                <Form.Group controlId="sourceAccountNumber">
                  <Form.Label>
                    <span>From:</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Account Number"
                    onChange={(e) =>
                      this._saveTransactionAccount(e, this.state.role.source)
                    }
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="destinationAccountNumber">
                  <Form.Label>
                    <span>To:</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Account Number"
                    onChange={(e) =>
                      this._saveTransactionAccount(
                        e,
                        this.state.role.destination,
                      )
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className={this.state.styles.amountSelection}>
              <Col>
                <Form.Group controlId="assetAmount">
                  <Form.Control
                    type="text"
                    onChange={(e) => this._saveAmount(e)}
                    onBlur={() => this._formatNumber(this.state.amount)}
                    placeholder="0.00"
                    value={this.state.amount}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="assetSelection">
                  <Form.Control
                    value={this.state.asset}
                    as="select"
                    onChange={(e) => this._saveAsset(e)}
                  >
                    <option value="EVRY">EVRY</option>
                    <option value="XLM">STELLAR</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Container>
        </Card.Body>
        <Card.Footer className={this.state.styles.footer}>
          <Container fluid>
            <Row>
              <Col className={this.state.styles.footerBtn}>
                <Button type="submit" variant="dark">
                  Transfer
                </Button>
              </Col>
            </Row>
          </Container>
        </Card.Footer>
      </Form>
    )
  }
}

WarpContent.propTypes = {
  collectTxHashesData: PropTypes.shape({
    stellar: PropTypes.string,
    evry: PropTypes.string,
  }),
  collectTxHashesPending: PropTypes.bool,
  collectTxHashesError: PropTypes.object,
  toEvry: PropTypes.func.isRequired,
}
