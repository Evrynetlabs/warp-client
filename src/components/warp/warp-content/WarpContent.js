import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import classNames from 'classnames'
import { Container, Row, Col, Button, Form } from 'react-bootstrap'
import 'Components/warp/warp-content/warpContent.scss'
import { numberToMoneyString, moneyToNumberString } from '@/utils/format'
import PropTypes from 'prop-types'
import Warp from 'warp-js'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import find from 'lodash/find'
import BigNumber from 'bignumber.js'
import StellarBase from 'stellar-base'
import config from '@/config'
const {
  evrynet: { ATOMIC_STELLAR_DECIMAL_UNIT },
} = config

export default class WarpContent extends Component {
  constructor(props) {
    super(props)
    this.warp = new Warp()
    this._toMoneyString = this._toMoneyString.bind(this)
    this._validateAmount = this._validateAmount.bind(this)
    const defaultFunc = {
      onChangeValidation: (elem) => elem,
      onBlurValidation: (elem) => elem,
    }
    const initialState = {
      styles: this._initStyles(),
      formControls: {
        asset: {
          value: this.warp.utils.getEvryAsset().getCode(),
          touched: false,
          valid: false,
          onChangeValidation: defaultFunc.onChangeValidation,
        },
        amount: {
          value: '',
          placeholder: '0.00',
          touched: false,
          valid: false,
          onChangeValidation: defaultFunc.onChangeValidation,
          onBlurValidation: defaultFunc.onBlurValidation,
          onBlurValueAssign: this._toMoneyString,
        },
        sourceAccount: {
          value: '',
          placeholder: 'Account Number',
          touched: false,
          valid: false,
          onChangeValidation: this._validateStellarAccount,
        },
        destinationAccount: {
          value: '',
          placeholder: 'Account Number',
          touched: false,
          valid: false,
          onChangeValidation: this._validateEvrynetAccount,
        },
        onSubmitValidation: this._validateAmount,
        valid: null,
        touched: false,
      },
      transferFunc: props.toEvrynet,
    }
    this.state = {
      ...initialState,
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
    const stylesContentAmountInput = `${stylesContentAmountSelection}__input`
    const stylesFooterButton = `${stylesFooter}__btn`
    return {
      main: stylesMain,
      content: stylesContent,
      footer: stylesFooter,
      footerBtn: stylesFooterButton,
      amountSelection: stylesContentAmountSelection,
      amountInput: stylesContentAmountInput,
      accountInput: stylesContentAccountInput,
      accountInputSrc: stylesContentAccountInputSrc,
      accountInputDest: stylesContentAccountInputDest,
      form: stylesForm,
    }
  }

  _validateStellarAccount(e) {
    let isValid = true
    let errorMessage = null

    if (!e.value) {
      isValid = false
      errorMessage = 'Stellar secret key is required.'
    } else if (!StellarBase.StrKey.isValidEd25519SecretSeed(e.value)) {
      isValid = false
      errorMessage = 'Invalid Stellar secret key format.'
    }

    e.valid = isValid
    e.errorMessage = errorMessage
    return e
  }

  _validateEvrynetAccount(e) {
    let isValid = true
    let errorMessage = null

    if (!e.value) {
      isValid = false
      errorMessage = 'Evrynet secret key is required.'
    } else if (!/^[a-f0-9]{64}$/i.test(e.value)) {
      isValid = false
      errorMessage = 'Invalid Evrynet secret key format.'
    }

    e.valid = isValid
    e.errorMessage = errorMessage
    return e
  }

  _changeHandler(event) {
    const name = event.target.name
    const value = event.target.value
    const updatedControls = {
      ...this.state.formControls,
    }
    let updatedFormElement = {
      ...updatedControls[name],
    }
    updatedFormElement.value = value
    updatedFormElement.touched = true
    updatedFormElement = updatedFormElement.onChangeValidation(
      updatedFormElement,
    )
    updatedControls[name] = updatedFormElement
    this.setState({
      formControls: updatedControls,
    })
  }

  _blurHandler(event) {
    const value = event.target.value
    const name = event.target.name
    const updatedControls = {
      ...this.state.formControls,
    }
    let updatedFormElement = {
      ...updatedControls[name],
    }
    updatedFormElement.value = updatedFormElement.onBlurValueAssign(value)
    updatedFormElement.touched = true
    updatedFormElement = updatedFormElement.onBlurValidation(updatedFormElement)
    updatedControls[name] = updatedFormElement
    this.setState({
      formControls: updatedControls,
    })
  }

  _toMoneyString(amount) {
    let decimal
    if (!isEmpty(this.props.whitelistedAssets.state)) {
      const whitelistedAsset = this._getWhitelistedAssetByCode(
        this.state.formControls.asset.value,
      )
      decimal = whitelistedAsset ? whitelistedAsset.decimal : whitelistedAsset
    }
    return numberToMoneyString(Number(moneyToNumberString(amount)), decimal)
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

  _updateTransferFunction(prevProps) {
    if (prevProps.isToEvry === this.props.isToEvry) return
    this.setState({
      transferFunc: this.props.isToEvry
        ? this.props.toEvrynet
        : this.props.toStellar,
    })
  }

  _switchAccounts(prevProps) {
    if (prevProps.isToEvry === this.props.isToEvry) return
    const updatedFormControls = {
      ...this.state.formControls,
    }
    const temp = updatedFormControls.sourceAccount
    updatedFormControls.sourceAccount = {
      ...updatedFormControls.destinationAccount,
    }
    updatedFormControls.destinationAccount = { ...temp }
    this.setState({
      formControls: updatedFormControls,
    })
  }

  _getWhitelistedAssetByCode(code) {
    return find(this.props.whitelistedAssets.state, (ech) => {
      return ech.getCode() === code
    })
  }

  async _transfer() {
    const asset = this._getWhitelistedAssetByCode(
      this.state.formControls.asset.value,
    )
    await this.state.transferFunc({
      asset,
      amount: moneyToNumberString(this.state.formControls.amount.value),
      src: this.state.formControls.sourceAccount.value,
      dest: this.state.formControls.destinationAccount.value,
    })
  }

  async _validateAmount() {
    const asset = this._getWhitelistedAssetByCode(
      this.state.formControls.asset.value,
    )
    await this.props.getAccountBalance({
      asset,
      privateKey: this.state.formControls.sourceAccount.value,
    })
    const decimal = this.props.isToEvry
      ? ATOMIC_STELLAR_DECIMAL_UNIT
      : asset.decimal
    console.log(decimal, 'decimal na jah')
    const hasValidAmount = new BigNumber(
      this.props.accountBalance.state,
    ).isGreaterThanOrEqualTo(
      new BigNumber(
        moneyToNumberString(this.state.formControls.amount.value),
      ).shiftedBy(decimal),
    )
    return hasValidAmount
  }

  async _validateSubmission() {
    const updatedFormControls = {
      ...this.state.formControls,
    }
    updatedFormControls.valid = await updatedFormControls.onSubmitValidation()
    updatedFormControls.touched = true
    this.setState({
      formControls: updatedFormControls,
    })
  }

  async _handleSubmit(e) {
    try {
      e.preventDefault()
      await this._validateSubmission()
      if (!this.state.formControls.valid) return
      await this._transfer()
    } catch (err) {
      console.error(err)
    }
  }

  componentDidUpdate(prevProps) {
    this._updateTransferFunction(prevProps)
    this._switchAccounts(prevProps)
  }

  async componentDidMount() {
    await this.props.getWhitelistAssets()
  }

  render() {
    return (
      <Form
        name="form"
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
                    name="sourceAccount"
                    type="text"
                    placeholder={
                      this.state.formControls.sourceAccount.placeholder
                    }
                    value={this.state.formControls.sourceAccount.value}
                    onChange={(e) => {
                      this._changeHandler(e)
                    }}
                    isInvalid={
                      this.state.formControls.sourceAccount.touched &&
                      !this.state.formControls.sourceAccount.valid
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {this.state.formControls.sourceAccount.errorMessage}
                  </Form.Control.Feedback>
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
                    name="destinationAccount"
                    type="text"
                    placeholder={
                      this.state.formControls.destinationAccount.placeholder
                    }
                    value={this.state.formControls.destinationAccount.value}
                    onChange={(e) => {
                      this._changeHandler(e)
                    }}
                    isInvalid={
                      this.state.formControls.destinationAccount.touched &&
                      !this.state.formControls.destinationAccount.valid
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {this.state.formControls.destinationAccount.errorMessage}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row className={this.state.styles.amountSelection}>
              <Col>
                <Form.Group controlId="assetAmount">
                  <Form.Control
                    name="amount"
                    type="text"
                    onChange={(e) => {
                      this._changeHandler(e)
                    }}
                    onBlur={(e) => {
                      this._blurHandler(e)
                    }}
                    placeholder={this.state.formControls.amount.placeholder}
                    value={this.state.formControls.amount.value}
                    isInvalid={
                      !this.state.formControls.valid &&
                      this.state.formControls.touched
                    }
                    className={this.state.styles.amountInput}
                  />
                  <Form.Control.Feedback type="invalid">
                    Insufficient Amount
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="assetSelection">
                  <Form.Control
                    name="asset"
                    value={this.state.formControls.asset.value}
                    as="select"
                    onChange={(e) => this._changeHandler(e)}
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
  accountBalance: PropTypes.shape({
    state: PropTypes.string,
    loading: PropTypes.bool,
    error: PropTypes.object,
  }),
  toEvrynet: PropTypes.func.isRequired,
  toStellar: PropTypes.func.isRequired,
  isToEvry: PropTypes.bool.isRequired,
  getWhitelistAssets: PropTypes.func.isRequired,
  getAccountBalance: PropTypes.func.isRequired,
}
