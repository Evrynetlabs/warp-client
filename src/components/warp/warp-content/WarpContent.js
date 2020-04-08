import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import classNames from 'classnames'
import { Container, Row, Col, Button, Form } from 'react-bootstrap'
import { MaskPasswordInput } from 'Components/shared'
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
import { Select } from 'Components/shared'
import { ResultComponent } from 'Components/result'
import produce from 'immer'
import Modal from 'react-modal'
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
      stylesMain: this.constructor.name,
      error: null,
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
          disabled: false,
          effects: [
            { name: 'amount', funcs: [this._validateAvailableAmounts] },
            { name: 'destinationAccount', funcs: [this._validateTrustlines] },
          ],
        },
      },
      transferFunc: props.toEvrynet,
      result: null,
      showResult: false,
    }
    this.state = {
      ...this.initialState,
    }
  }

  /*
    core state functions
   */
  _disableButton(isDisable) {
    this.setState(
      produce((draft) => {
        draft.formControls.form.disabled = isDisable
      }),
    )
  }

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
  }

  async _effect(sourceElement, formControls) {
    const promises = []
    if (has(sourceElement, 'effects')) {
      for (const effected of sourceElement.effects) {
        formControls[effected.name].touched = true
        for (const effect of effected.funcs) {
          promises.push(effect(formControls[effected.name], formControls))
        }
      }
    }
    await Promise.all(promises)
  }

  async _transfer() {
    if (this._isTransferDisabled()) return
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
    if (this.props.txHashes.state) {
      const result = {
        ...payload,
        asset: {
          decimal: asset.decimal,
          code: asset.code,
        },
        isToEvrynet: this.props.isToEvrynet,
        txHashes: {
          state: this.props.txHashes.state,
        },
      }
      this.setState({
        result,
      })
      return
    }
    if (this.props.txHashes.error) {
      this.setState((_, props) => ({
        error: props.txHashes.error.toString(),
      }))
    }
  }

  _format(e) {
    if (e.valid && has(e, 'formats')) {
      e.formats.forEach((format) => {
        e.value = format(e.value)
      })
    }
    return e
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
    await this.props.getTrustlines({
      privateKey: formControls.sourceAccount.value,
    })
    const trustlinesCount = this.props.trustlines.state.length
    await this.props.getAccountBalance({
      asset: whitelistedAsset,
      privateKey: formControls.sourceAccount.value,
    })
    const decimal = this.props.isToEvrynet
      ? ATOMIC_STELLAR_DECIMAL_UNIT
      : whitelistedAsset.getDecimal()
    const stellarMinBalance = new BigNumber(
      (2 + trustlinesCount) * 0.5,
    ).shiftedBy(decimal)
    const isGreaterThanOrEqual = new BigNumber(
      this.props.accountBalance.state,
    ).isGreaterThanOrEqualTo(
      new BigNumber(formControls.amount.value).shiftedBy(decimal),
    )
    const isLumens = whitelistedAsset.toStellarFormat().isNative()
    const hasMinimumBalance =
      this.props.isToEvrynet && isLumens
        ? new BigNumber(this.props.accountBalance.state)
            .minus(StellarBase.BASE_FEE)
            .minus(new BigNumber(formControls.amount.value).shiftedBy(decimal))
            .isGreaterThanOrEqualTo(stellarMinBalance)
        : true
    e.valid = isGreaterThanOrEqual && hasMinimumBalance
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

  async _changeHandler({ name, value }) {
    const updater = async (state) => {
      return await produce(state, async (draft) => {
        draft.formControls[name].touched = true
        draft.formControls[name].value = value
        await this._validate(draft.formControls[name], draft.formControls)
        await this._effect(draft.formControls[name], draft.formControls)
      })
    }
    const nextState = await updater(this.state)
    this.setState(nextState)
  }

  async _blurHandler({ name }) {
    const updater = async (state) => {
      return await produce(state, async (draft) => {
        draft.formControls[name].touched = true
        await this._validate(draft.formControls[name], draft.formControls)
        this._format(draft.formControls[name])
      })
    }
    const nextState = await updater(this.state)
    this.setState(nextState)
  }

  async _submitHandler({ name }) {
    try {
      this.props.startLoading()
      this._disableButton(true)
      await this._onSubmit({ name })
      await this._transfer()
      this.props.stopLoading()
      this._disableButton(false)
    } catch (err) {
      this.setState({
        error: err.toString(),
      })
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
      return {
        value: ech.getCode(),
        label: ech.getCode(),
        name: 'asset',
      }
    })
  }

  _getWhitelistedAssetByCode(code) {
    return find(this.props.whitelistedAssets.state, (ech) => {
      return ech.getCode() === code
    })
  }

  _isTransferDisabled() {
    let result =
      reduce(
        this.state.formControls,
        (res, ech) => {
          if (has(ech, 'valid')) return res || !ech.valid
          return res
        },
        false,
      ) || this.state.formControls.form.disabled
    return result
  }

  async _onSubmit({ name }) {
    const updater = async (state) => {
      return await produce(state, async (draft) => {
        draft.formControls[name].touched = true
        await this._effect(draft.formControls[name], draft.formControls)
      })
    }
    const nextState = await updater(this.state)
    this.setState(nextState)
  }

  _removeResult() {
    this.setState({
      result: null,
      showResult: false,
    })
  }

  async _handleIsToEvrynet(prevProps) {
    if (prevProps.isToEvrynet === this.props.isToEvrynet) return
    const elements = ['sourceAccount', 'destinationAccount', 'amount']
    const validationPromises = []
    const switchAccount = produce((draft, props) => {
      draft.transferFunc = props.isToEvrynet ? props.toEvrynet : props.toStellar
      const temp = draft.formControls.sourceAccount
      draft.formControls.sourceAccount = draft.formControls.destinationAccount
      draft.formControls.destinationAccount = temp
      for (const e of elements) {
        validationPromises.push(this._validate(draft[e], draft))
      }
      Promise.all(validationPromises)
    })
    this.setState(switchAccount)
  }

  _handleResult(prevState) {
    if (prevState.result === this.state.result) return
    this.setState((state) => ({
      showResult: !!state.result,
    }))
  }

  async componentDidUpdate(prevProps, prevState) {
    await this._handleIsToEvrynet(prevProps)
    this._handleResult(prevState)
  }

  async componentDidMount() {
    this.props.startLoading()
    await this.props.getWhitelistAssets()
    this.props.stopLoading()
  }

  render() {
    const resultProps = {
      removeResult: this._removeResult.bind(this),
      ...this.state.result,
    }
    return (
      <React.Fragment>
        <Form
          name="form"
          className={`${this.state.stylesMain}__form`}
          onSubmit={async (e) => {
            event.preventDefault()
            await this._submitHandler(e.target)
          }}
        >
          <Card.Body className={`${this.state.stylesMain}__form__content`}>
            <Container fluid className="px-0">
              <Row className="mx-auto my-0">
                <Col
                  className={classNames('flex-grow-1', 'px-0', [
                    `${this.state.stylesMain}__form__content__col`,
                  ])}
                >
                  <Form.Group controlId="sourceAccountNumber">
                    <Form.Label
                      className={classNames(
                        'text-format-label-light',
                        `${this.state.stylesMain}__form__content__label`,
                      )}
                    >
                      <span>From</span>
                    </Form.Label>
                    <MaskPasswordInput
                      className={classNames(
                        `${this.state.stylesMain}__form__content__input__src`,
                        `${this.state.stylesMain}__form__content__input`,
                        'input-form',
                      )}
                      name="sourceAccount"
                      type="text"
                      placeholder={
                        this.state.formControls.sourceAccount.placeholder
                      }
                      value={this.state.formControls.sourceAccount.value}
                      onChange={(e) => {
                        this._changeHandler(e.target)
                      }}
                      onBlur={(e) => {
                        this._blurHandler(e.target)
                      }}
                      isInvalid={
                        this.state.formControls.sourceAccount.touched &&
                        !this.state.formControls.sourceAccount.valid
                      }
                    />
                    <Form.Control.Feedback
                      className={classNames(
                        'position-absolute',
                        this.state.formControls.sourceAccount.touched &&
                          !this.state.formControls.sourceAccount.valid
                          ? 'd-block'
                          : '',
                      )}
                      type="invalid"
                    >
                      <div
                        className={`${this.state.stylesMain}__form__content__errorFeedback__form`}
                      >
                        {this.state.formControls.sourceAccount.errorMessage}
                      </div>
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col
                  className={classNames(
                    `${this.state.stylesMain}__form__content__col`,
                    'px-0',
                  )}
                >
                  <span>
                    <i className="fas fa-arrow-right"></i>
                  </span>
                </Col>
                <Col
                  className={classNames(
                    `${this.state.stylesMain}__form__content__col`,
                    'flex-grow-1',
                    'px-0',
                  )}
                >
                  <Form.Group controlId="destinationAccountNumber">
                    <Form.Label
                      className={classNames(
                        'text-format-label-light',
                        `${this.state.stylesMain}__form__content__label`,
                      )}
                    >
                      <span>To</span>
                    </Form.Label>
                    <MaskPasswordInput
                      className={classNames(
                        `${this.state.stylesMain}__form__content__input__dest`,
                        `${this.state.stylesMain}__form__content__input`,
                        'input-form',
                      )}
                      name="destinationAccount"
                      type="text"
                      placeholder={
                        this.state.formControls.destinationAccount.placeholder
                      }
                      value={this.state.formControls.destinationAccount.value}
                      onChange={(e) => {
                        this._changeHandler(e.target)
                      }}
                      onBlur={(e) => {
                        this._blurHandler(e.target)
                      }}
                      isInvalid={
                        this.state.formControls.destinationAccount.touched &&
                        !this.state.formControls.destinationAccount.valid
                      }
                    />
                    <Form.Control.Feedback
                      className={classNames(
                        'position-absolute',
                        this.state.formControls.destinationAccount.touched &&
                          !this.state.formControls.destinationAccount.valid
                          ? 'd-block'
                          : '',
                      )}
                      type="invalid"
                    >
                      <div
                        className={`${this.state.stylesMain}__form__content__errorFeedback__form`}
                      >
                        {
                          this.state.formControls.destinationAccount
                            .errorMessage
                        }
                      </div>
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mx-auto my-0">
                <Col className="text-center py-5">
                  <span
                    className={classNames(
                      'text-format-title-light',
                      'font-weight-bold',
                    )}
                  >
                    Amount
                  </span>
                </Col>
              </Row>
              <Row
                className={classNames(
                  'justify-content-start',
                  'mx-auto',
                  'my-0',
                )}
              >
                <Col xs={8} className={classNames('px-0')}>
                  <Form.Group controlId="assetAmount">
                    <Form.Label
                      className={classNames(
                        'text-format-label-light',
                        `${this.state.stylesMain}__form__content__label`,
                      )}
                    >
                      <span>Credit</span>
                    </Form.Label>
                    <Container fluid className="px-0">
                      <Row className={classNames('mx-auto', 'my-0')}>
                        <Col className={classNames('px-0', 'flex-grow-0')}>
                          <Select
                            options={this._listWhitelistedAssetsOptions()}
                            selectedItem={this.state.formControls.asset.value}
                            onChange={({ name, value }) => {
                              this._changeHandler({ name, value })
                            }}
                          ></Select>
                        </Col>
                        <Col className={classNames('px-0')}>
                          <Form.Control
                            name="amount"
                            type="text"
                            onChange={(e) => {
                              this._changeHandler(e.target)
                            }}
                            onBlur={(e) => {
                              this._blurHandler(e.target)
                            }}
                            placeholder={
                              this.state.formControls.amount.placeholder
                            }
                            value={this.state.formControls.amount.value}
                            isInvalid={
                              !this.state.formControls.amount.valid &&
                              this.state.formControls.amount.touched
                            }
                            className={classNames(
                              `${this.state.stylesMain}__form__content__input`,
                              `${this.state.stylesMain}__form__content__input__amount`,
                              'input-form',
                            )}
                          />
                          <Form.Control.Feedback
                            className="position-absolute"
                            type="invalid"
                          >
                            <div
                              className={classNames(
                                `${this.state.stylesMain}__form__content__errorFeedback__form`,
                                `${this.state.stylesMain}__form__content__errorFeedback__amount`,
                              )}
                            >
                              {this.state.formControls.amount.errorMessage}
                            </div>
                          </Form.Control.Feedback>
                        </Col>
                      </Row>
                    </Container>
                  </Form.Group>
                </Col>
                <Col xs={4} className={classNames('pl-5', 'pr-0', 'col-4')}>
                  <Button
                    type="submit"
                    disabled={this._isTransferDisabled()}
                    className={classNames(
                      'w-100',
                      'input-form',
                      `${this.state.stylesMain}__form__content__btn`,
                    )}
                  >
                    TRANSFER
                  </Button>
                </Col>
              </Row>
            </Container>
          </Card.Body>
        </Form>
        {this.state.error && (
          <Container>
            <Row>
              <Col
                className={`${this.state.stylesMain}__form__content__errorFeedback__submit`}
              >
                <span> {this.state.error} </span>
              </Col>
            </Row>
          </Container>
        )}
        <Modal
          isOpen={this.state.showResult}
          overlayClassName={`${this.state.stylesMain}__resultModal__overlay`}
          className={`${this.state.stylesMain}__resultModal__item`}
        >
          {this.state.showResult && (
            <ResultComponent {...resultProps}></ResultComponent>
          )}
        </Modal>
      </React.Fragment>
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
  startLoading: PropTypes.func.isRequired,
  stopLoading: PropTypes.func.isRequired,
}
