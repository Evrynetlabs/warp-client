import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import classNames from 'classnames'
import { Container, Row, Col, Button, Form } from 'react-bootstrap'
import 'Components/warp/warp-content/warpContent.scss'
import { removeTrailingDot, removeLeadingZero } from '@/utils/format'
import PropTypes from 'prop-types'
import { getWarpInstance } from '@/utils/singleton'
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
    this.warp = getWarpInstance()
    this._validateAvailableAmounts = this._validateAvailableAmounts.bind(this)
    this._validateDecimal = this._validateDecimal.bind(this)
    this._validateTrustlines = this._validateTrustlines.bind(this)
    this.initialState = {
      styles: this._initStyles(),
      formControls: {
        asset: {
          value: this.warp.utils.getEvryAsset().getCode(),
          effects: [{ name: 'amount', funcs: [this._validate] }],
        },
        amount: {
          name: 'Amount',
          value: '',
          placeholder: '0.00',
          touched: false,
          valid: false,
          validations: [
            this._validateNotEmpty,
            this._validateIsNumber,
            this._validateMoreThanZero,
            this._validateDecimal,
          ],
          formats: [removeLeadingZero, removeTrailingDot],
        },
        sourceAccount: {
          name: 'Stellar secret key',
          value: '',
          placeholder: 'Account Number',
          touched: false,
          valid: false,
          validations: [
            this._validateNotEmpty,
            this._validateStellarSecretFormat,
          ],
        },
        destinationAccount: {
          name: 'Evrynet secret key',
          value: '',
          placeholder: 'Account Number',
          touched: false,
          valid: false,
          validations: [
            this._validateNotEmpty,
            this._validateEvrynetSecretFormat,
          ],
        },
        form: {
          effects: [
            { name: 'amount', funcs: [this._validateAvailableAmounts] },
            { name: 'destinationAccount', funcs: [this._validateTrustlines] },
          ],
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

  /*
    core state functions
   */

  async _validate(e, formControls) {
    if (has(e, 'validations')) {
      e.valid = true
      e.errorMessage = null
      e.validations.forEach((validate) => {
        if (e.valid) {
          validate(e, formControls)
        }
      })
    }
    return e
  }

  _format(e) {
    if (e.valid && has(e, 'formats')) {
      e.formats.forEach((format) => {
        e.value = format(e.value)
      })
    }
    return e
  }

  async _effect(sourceElement, formControls) {
    let updatedFormControls = { ...formControls }
    if (has(sourceElement, 'effects')) {
      for (const effected of sourceElement.effects) {
        let updatedElement = updatedFormControls[effected.name]
        updatedElement.touched = true
        for (const effect of effected.funcs) {
          await effect(updatedElement, formControls)
        }
        updatedFormControls[effected.name] = updatedElement
      }
    }
    return updatedFormControls
  }

  async _transfer() {
    if (this._disabledTransfer()) return
    const asset = this._getWhitelistedAssetByCode(
      this.state.formControls.asset.value,
    )
    const payload = {
      asset,
      amount: this.state.formControls.amount.value,
      src: this.state.formControls.sourceAccount.value,
      dest: this.state.formControls.destinationAccount.value,
    }
    await this.state.transferFunc(payload)
    const locationState = {
      ...payload,
      asset: {
        decimal: asset.decimal,
        code: asset.code,
      },
      isToEvrynet: this.props.isToEvrynet,
      txHashes: {
        state: this.props.txHashes.state,
        error: this.props.txHashes.error
          ? this.props.txHashes.error.toString()
          : null,
      },
    }
    this._toResult(locationState)
  }

  /*
    validation functions
   */

  _validateNotEmpty(e) {
    if (!e.value) {
      e.valid = false
      e.errorMessage = `${e.name} is required.`
    }
    return e
  }

  _validateStellarSecretFormat(e) {
    if (!StellarBase.StrKey.isValidEd25519SecretSeed(e.value)) {
      e.valid = false
      e.errorMessage = 'Invalid Stellar secret key format.'
    }
    return e
  }

  _validateEvrynetSecretFormat(e) {
    if (!/^[a-f0-9]{64}$/i.test(e.value)) {
      e.valid = false
      e.errorMessage = 'Invalid Evrynet secret key format.'
    }
    return e
  }

  _validateIsNumber(e) {
    if (isNaN(Number(e.value))) {
      e.valid = false
      e.errorMessage = 'Amount must be a number.'
    }
    return e
  }

  _validateMoreThanZero(e) {
    if (Number(e.value) <= 0) {
      e.valid = false
      e.errorMessage = 'Amount must be greater than zero.'
    }
    return e
  }

  _validateDecimal(e, formControls) {
    const parts = split(e.value, '.')
    const hasDecimals = parts.length >= 2
    const whitelistedAsset = this._getWhitelistedAssetByCode(
      formControls.asset.value,
    )
    const decimal = min([
      ATOMIC_STELLAR_DECIMAL_UNIT,
      whitelistedAsset.getDecimal(),
    ])
    if (hasDecimals && parts[1].length > decimal) {
      e.valid = false
      e.errorMessage = `Amount can only support a precision of ${decimal} decimals.`
    }
    return e
  }

  async _validateAvailableAmounts(e, formControls) {
    const whitelistedAsset = this._getWhitelistedAssetByCode(
      formControls.asset.value,
    )
    await this.props.getAccountBalance({
      asset: whitelistedAsset,
      privateKey: formControls.sourceAccount.value,
    })
    const decimal = this.props.isToEvrynet
      ? ATOMIC_STELLAR_DECIMAL_UNIT
      : whitelistedAsset.getDecimal()
    e.valid = new BigNumber(
      this.props.accountBalance.state,
    ).isGreaterThanOrEqualTo(
      new BigNumber(formControls.amount.value).shiftedBy(decimal),
    )
    e.errorMessage = e.valid ? null : 'Insufficient Amount'
    return e
  }

  async _validateTrustlines(e, formControls) {
    // validate only on moving asset to Stellar
    if (this.props.isToEvrynet) return e
    const selectedAsset = this._getWhitelistedAssetByCode(
      formControls.asset.value,
    )
    // skip validation when asset type is Stellar's native
    if (selectedAsset.code === 'XLM' && !selectedAsset.issuer) return e
    await this.props.getTrustlines({
      privateKey: formControls.destinationAccount.value,
    })
    const trustlines = this.props.trustlines.state
    e.valid = trustlines.some((trustline) => {
      return (
        trustline.code === selectedAsset.code &&
        trustline.issuer === selectedAsset.issuer
      )
    })
    e.errorMessage = e.valid
      ? null
      : `The recipient Stellar account has no ${selectedAsset.code} trustline.`
    return e
  }

  /*
    handler functions
   */

  async _changeHandler(event) {
    const name = event.target.name
    const value = event.target.value
    let updatedControls = {
      ...this.state.formControls,
    }

    // update changing element
    let updatedFormElement = {
      ...updatedControls[name],
    }
    // update element state
    // touch-update-validate
    updatedFormElement.touched = true
    updatedFormElement.value = value
    updatedFormElement = await this._validate(
      updatedFormElement,
      updatedControls,
    )
    updatedControls[name] = updatedFormElement

    // update the effected elements
    updatedControls = await this._effect(updatedFormElement, updatedControls)

    this.setState({
      formControls: updatedControls,
    })
  }

  async _blurHandler(event) {
    const name = event.target.name
    const updatedControls = {
      ...this.state.formControls,
    }
    let updatedFormElement = {
      ...updatedControls[name],
    }
    // update element state
    // touch-validate-format
    updatedFormElement.touched = true
    updatedFormElement = await this._validate(
      updatedFormElement,
      updatedControls,
    )
    updatedControls[name] = this._format(updatedFormElement)
    this.setState({
      formControls: updatedControls,
    })
  }

  async _submitHandler(event) {
    try {
      event.preventDefault()
      this._onSubmit(event).then(() => this._transfer())
    } catch (err) {
      console.error(err)
    }
  }

  /*
    others functions
   */

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
  _getWhitelistedAssetByCode(code) {
    return find(this.props.whitelistedAssets.state, (ech) => {
      return ech.getCode() === code
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

  _toResult(payload) {
    this.props.push({
      pathname: '/result',
      state: payload,
    })
  }

  _updateTransferFunction() {
    return this.props.isToEvrynet ? this.props.toEvrynet : this.props.toStellar
  }

  _switchAccounts(updatedFormControls) {
    const temp = updatedFormControls.sourceAccount
    updatedFormControls.sourceAccount = {
      ...updatedFormControls.destinationAccount,
    }
    updatedFormControls.destinationAccount = { ...temp }
    return updatedFormControls
  }

  async _updateAddressError(updatedFormControls) {
    const elements = ['sourceAccount', 'destinationAccount', 'amount']
    for (const e of elements) {
      updatedFormControls[e].touched = true
      // eslint-disable-next-line require-atomic-updates
      updatedFormControls[e] = await this._validate(
        updatedFormControls[e],
        updatedFormControls,
      )
    }
    return updatedFormControls
  }

  async _onSubmit(event) {
    const name = event.target.name
    let updatedControls = {
      ...this.state.formControls,
    }
    let updatedFormElement = {
      ...updatedControls[name],
    }

    // update element state
    // touch-effect
    updatedFormElement.touched = true
    updatedControls[name] = updatedFormElement

    // update the effected elements
    updatedControls = await this._effect(updatedFormElement, updatedControls)
    this.setState({
      formControls: updatedControls,
    })
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.isToEvrynet === this.props.isToEvrynet) return
    const updatedState = this.state
    updatedState.transferFunc = this._updateTransferFunction()
    updatedState.formControls = this._switchAccounts(updatedState.formControls)
    updatedState.formControls = await this._updateAddressError(
      updatedState.formControls,
    )
    this.setState(updatedState)
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
          await this._submitHandler(e)
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
                    onBlur={(e) => {
                      this._blurHandler(e)
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
                    onBlur={(e) => {
                      this._blurHandler(e)
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
      evrynet: PropTypes.string,
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
  trustlines: PropTypes.shape({
    state: PropTypes.array,
    loading: PropTypes.bool,
    error: PropTypes.object,
  }),
  toEvrynet: PropTypes.func.isRequired,
  toStellar: PropTypes.func.isRequired,
  isToEvrynet: PropTypes.bool.isRequired,
  getWhitelistAssets: PropTypes.func.isRequired,
  getAccountBalance: PropTypes.func.isRequired,
  getTrustlines: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
}
