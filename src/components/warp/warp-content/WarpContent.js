import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import classNames from 'classnames'
import { Container, Row, Col, Button, Form } from 'react-bootstrap'
import 'Components/warp/warp-content/warpContent.scss'
import { numberToCurrencyString, currencyToNumberString } from '@/utils/format'
import PropTypes from 'prop-types'
import Warp from 'warp-js'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import find from 'lodash/find'

export default class WarpContent extends Component {
  constructor(props) {
    super(props)
    this.warp = new Warp()
    this.initialState = {
      styles: this._initStyles(),
      amount: '',
      asset: this.warp.utils.getEvryAsset().getCode(),
      role: {
        source: 'source',
        destination: 'destination',
      },
      sourceAccount: '',
      destinationAccount: '',
      transferFunc: props.toEvry,
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
    const stylesForm = `${stylesMain}__form`
    const stylesContent = `${stylesForm}__content`
    const stylesContentAccountInput = `${stylesContent}__input`
    const stylesContentAccountInputSrc = `${stylesContentAccountInput}__src`
    const stylesContentAccountInputDest = `${stylesContentAccountInput}__dest`
    const stylesContentAmountSelection = `${stylesContent}__amount`
    const stylesFooterButton = `${stylesFooter}__btn`
    return {
      main: stylesMain,
      content: stylesContent,
      footer: stylesFooter,
      footerBtn: stylesFooterButton,
      amountSelection: stylesContentAmountSelection,
      accountInput: stylesContentAccountInput,
      accountInputSrc: stylesContentAccountInputSrc,
      accountInputDest: stylesContentAccountInputDest,
      form: stylesForm,
    }
  }

  _formatNumber(amount) {
    let decimal
    if (!isEmpty(this.props.whitelistedAssets.state)) {
      const whitelistedAsset = find(this.props.whitelistedAssets.state, {
        code: this.state.asset,
      })
      decimal = whitelistedAsset ? whitelistedAsset.decimal : whitelistedAsset
    }
    this.setState({
      amount: numberToCurrencyString(
        Number(currencyToNumberString(amount)),
        decimal,
      ),
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

  async componentDidMount() {
    await this.props.getWhitelistAssets()
  }

  async _handleSubmit(e) {
    e.preventDefault()
    let asset
    switch (this.state.asset) {
      case 'EVRY': {
        asset = this.warp.utils.getEvryAsset()
        break
      }
      case 'XLM': {
        asset = this.warp.utils.getLumensAsset()
        break
      }
      default:
        return null
    }
    await this.state.transferFunc({
      asset,
      amount: currencyToNumberString(this.state.amount),
      src: this.state.sourceAccount,
      dest: this.state.destinationAccount,
    })
  }

  _listWhitelistedAssetsOptions() {
    if (
      this.props.whitelistedAssets.loading ||
      isEmpty(this.props.whitelistedAssets.state)
    )
      return
    return map(this.props.whitelistedAssets.state, (ech) => {
      return (
        <option key={ech.getCode()} value={ech.getCode()}>
          {ech.getCode()}
        </option>
      )
    })
  }

  __updateTransferFunction(prevProps, prevState) {
    if (prevProps.isToEvry === this.props.isToEvry) return
    if (this.props.isToEvry) {
      this.setState({
        transferFunc: this.props.toEvry,
        sourceAccount: prevState.destinationAccount,
        destinationAccount: prevState.sourceAccount,
      })
      return
    }
    this.setState({
      transferFunc: this.props.toStellar,
      sourceAccount: prevState.destinationAccount,
      destinationAccount: prevState.sourceAccount,
    })
  }

  componentDidUpdate(prevProps, prevState) {
    this.__updateTransferFunction(prevProps, prevState)
  }

  render() {
    return (
      <Form
        className={this.state.styles.form}
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
                    className={classNames({
                      [this.state.styles.accountInputSrc]: true,
                      [this.state.styles.accountInput]: true,
                    })}
                    type="text"
                    placeholder="Account Number"
                    value={this.state.sourceAccount}
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
                    className={classNames({
                      [this.state.styles.accountInputDest]: true,
                      [this.state.styles.accountInput]: true,
                    })}
                    type="text"
                    placeholder="Account Number"
                    value={this.state.destinationAccount}
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
                    {this._listWhitelistedAssetsOptions()}
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
  txHashes: PropTypes.shape({
    state: PropTypes.shape({
      stellar: PropTypes.string,
      evry: PropTypes.string,
    }),
    loading: PropTypes.bool,
    error: PropTypes.object,
  }),
  whitelistedAssets: PropTypes.shape({
    state: PropTypes.array,
    loading: PropTypes.bool,
    error: PropTypes.object,
  }),
  toEvry: PropTypes.func.isRequired,
  toStellar: PropTypes.func.isRequired,
  isToEvry: PropTypes.bool.isRequired,
  getWhitelistAssets: PropTypes.func.isRequired,
}
