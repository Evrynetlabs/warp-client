import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import classNames from 'classnames'
import { Container, Row, Col, Button, Form } from 'react-bootstrap'
import 'Components/warp/warp-content/warpContent.scss'
import { removeLeadingZero } from '@/utils/format'
import PropTypes from 'prop-types'
import Warp from 'warp-js'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import find from 'lodash/find'
import BigNumber from 'bignumber.js'
import StellarBase from 'stellar-base'
import config from '@/config'
import split from 'lodash/split'
import reduce from 'lodash/reduce'
import has from 'lodash/has'
import min from 'lodash/min'
import isNaN from 'lodash/isNaN'
const {
  evrynet: { ATOMIC_STELLAR_DECIMAL_UNIT },
} = config

export default class WarpContent extends Component {
  constructor(props) {
    super(props)
    this.warp = new Warp()
    this._validateAmountOnSubmit = this._validateAmountOnSubmit.bind(this)
    this._validateAmountOnChange = this._validateAmountOnChange.bind(this)
    const defaultFunc = {
      onChangeValidation: (elem) => elem,
      onBlurValidation: (elem) => elem,
    }
    this.initialState = {
      styles: this._initStyles(),
      formControls: {
        asset: {
          value: this.warp.utils.getEvryAsset().getCode(),
          onChangeValidation: defaultFunc.onChangeValidation,
        },
        amount: {
          value: '',
          placeholder: '0.00',
          touched: false,
          valid: false,
          onChangeValidation: this._validateAmountOnChange,
          onBlurValidation: defaultFunc.onBlurValidation,
          onBlurValueAssign: removeLeadingZero,
          onSubmitValidation: this._validateAmountOnSubmit,
          errorMessage: '',
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
      },
      transferFunc: props.toEvrynet,
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
    e.touched = true
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
    e.touched = true
    e.valid = isValid
    e.errorMessage = errorMessage
    return e
  }

  _validateAmountOnChange(e) {
    const parts = split(e.value, '.')
    const hasDecimals = parts.length >= 2
    const whitelistedAsset = this._getWhitelistedAssetByCode(
      this.state.formControls.asset.value,
    )
    e.touched = true
    if (isEmpty(e.value)) {
      e.valid = false
      e.errorMessage = 'Amount is required.'
      return e
    }
    if (isNaN(Number(e.value))) {
      e.valid = false
      e.errorMessage = 'Amount must be a number.'
      return e
    }
    if (Number(e.value) <= 0) {
      e.valid = false
      e.errorMessage = 'Amount must be greater than zero.'
      return e
    }
    const decimal = min([
      ATOMIC_STELLAR_DECIMAL_UNIT,
      whitelistedAsset.getDecimal(),
    ])
    e.valid = hasDecimals ? parts[1].length <= decimal : true
    e.errorMessage = e.valid
      ? ''
      : `Amount can only support a precision of ${decimal} decimals.`

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
    this._resetValidation(name)
    updatedFormElement.value = value
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
    this._resetValidation(name)
    updatedFormElement = updatedFormElement.onBlurValidation(updatedFormElement)
    updatedFormElement.value = updatedFormElement.touched
      ? updatedFormElement.onBlurValueAssign(value)
      : value
    updatedControls[name] = updatedFormElement
    this.setState({
      formControls: updatedControls,
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

  _updateTransferFunction(prevProps) {
    if (prevProps.isToEvrynet === this.props.isToEvrynet) return
    this.setState({
      transferFunc: this.props.isToEvrynet
        ? this.props.toEvrynet
        : this.props.toStellar,
    })
  }

  _switchAccounts(prevProps) {
    if (prevProps.isToEvrynet === this.props.isToEvrynet) return
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

  _resetValidation(name) {
    const updatedControls = {
      ...this.state.formControls,
    }
    let updatedFormElement = {
      ...updatedControls[name],
    }
    updatedFormElement.valid = this.initialState.formControls[name].valid
    updatedFormElement.touched = this.initialState.formControls[name].touched
    updatedControls[name] = updatedFormElement
    this.setState({
      formControls: updatedControls,
    })
  }

  _disabledTransfer() {
    let result = reduce(
      this.state.formControls,
      (res, ech) => {
        if (has(ech, 'valid')) return res || !ech.valid
        return res
      },
      false,
    )
    return result
  }

  async _transfer() {
    const asset = this._getWhitelistedAssetByCode(
      this.state.formControls.asset.value,
    )
    await this.state.transferFunc({
      asset,
      amount: this.state.formControls.amount.value,
      src: this.state.formControls.sourceAccount.value,
      dest: this.state.formControls.destinationAccount.value,
    })
  }

  async _validateAmountOnSubmit(e) {
    const whitelistedAsset = this._getWhitelistedAssetByCode(
      this.state.formControls.asset.value,
    )
    await this.props.getAccountBalance({
      whitelistedAsset,
      privateKey: this.state.formControls.sourceAccount.value,
    })
    const decimal = this.props.isToEvrynet
      ? ATOMIC_STELLAR_DECIMAL_UNIT
      : whitelistedAsset.getDecimal()
    e.touched = true
    e.valid = new BigNumber(
      this.props.accountBalance.state,
    ).isGreaterThanOrEqualTo(
      new BigNumber(this.state.formControls.amount.value).shiftedBy(decimal),
    )
    e.errorMessage = e.valid ? '' : 'Insufficient Amount'
    return e
  }

  async _submitHandler(name) {
    const updatedControls = {
      ...this.state.formControls,
    }
    let updatedFormElement = {
      ...updatedControls[name],
    }
    this._resetValidation(name)
    updatedFormElement = await updatedFormElement.onSubmitValidation(
      updatedFormElement,
    )
    updatedControls[name] = updatedFormElement
    this.setState({
      formControls: updatedControls,
    })
  }

  async _handleSubmit(e) {
    try {
      e.preventDefault()
      let promises = []
      const names = split(e.target.name, ',')
      for (let name of names) {
        promises.push(this._submitHandler(name))
      }
      await Promise.all(promises)
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
        name="amount"
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
                      !this.state.formControls.amount.valid &&
                      this.state.formControls.amount.touched
                    }
                    className={this.state.styles.amountInput}
                  />
                  <Form.Control.Feedback type="invalid">
                    {this.state.formControls.amount.errorMessage}
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
                <Button
                  type="submit"
                  variant="dark"
                  disabled={this._disabledTransfer()}
                >
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
  isToEvrynet: PropTypes.bool.isRequired,
  getWhitelistAssets: PropTypes.func.isRequired,
  getAccountBalance: PropTypes.func.isRequired,
}
