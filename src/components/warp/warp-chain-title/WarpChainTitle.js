import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import classNames from 'classnames'
import { Container, Row, Col } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { ReactComponent as EvrynetIcon } from '@/assets/icons/evrynet.svg'
import { ReactComponent as StellarIcon } from '@/assets/icons/stellar.svg'
import { ReactComponent as SwapIcon } from '@/assets/icons/swap.svg'
import 'Components/warp/warp-chain-title/warpChainTitle.scss'

export default class WarpChainTitle extends Component {
  constructor(props) {
    super(props)
    const chain = {
      EVRYNET: EvrynetIcon,
      XLM: StellarIcon,
    }
    this.stylesMain = classNames({
      [this.constructor.name]: true,
    })
    this.stylesRow = `${this.stylesMain}__row`
    this.stylesAssetElem = `${this.stylesRow}__asset`
    this.stylesAssetText = `${this.stylesAssetElem}__text`
    this.stylesSwapElem = `${this.stylesRow}__swap`
    this.stylesSwapBubble = `${this.stylesSwapElem}__bubble`
    this.state = {
      styles: {
        main: this.stylesMain,
        asset: this.stylesAssetElem,
        swap: this.stylesSwapElem,
        row: this.stylesRow,
        assetText: this.stylesAssetText,
        swapBubble: this.stylesSwapBubble,
      },
      chain,
      swap: {
        src: chain.XLM,
        dest: chain.EVRYNET,
      },
    }
  }

  _updateSwapTitle(prevProps) {
    if (prevProps.isToEvrynet === this.props.isToEvrynet) return
    if (this.props.isToEvrynet) {
      this.setState({
        swap: {
          src: this.state.chain.XLM,
          dest: this.state.chain.EVRYNET,
        },
      })
      return
    }
    this.setState({
      swap: {
        src: this.state.chain.EVRYNET,
        dest: this.state.chain.XLM,
      },
    })
  }

  componentDidUpdate(prevProps) {
    this._updateSwapTitle(prevProps)
  }

  render() {
    const SrcAsset = this.state.swap.src
    const DestAsset = this.state.swap.dest
    return (
      <Card.Header className={this.state.styles.main}>
        <Container fluid>
          <Row className={this.state.styles.row}>
            <Col
              className={classNames(
                this.state.styles.asset,
                'text-format-title-light',
                'px-0',
              )}
            >
              <div className={this.state.styles.assetText}>
                <span>From</span> <SrcAsset></SrcAsset>
              </div>
            </Col>
            <Col
              className={classNames(
                this.state.styles.swap,
                'px-0',
                'flex-grow-0',
              )}
              onClick={() => {
                this.props.toggleTransferSwitch()
              }}
            >
              <div className="speech-bubble">
                <span className={this.state.styles.swapBubble}>
                  Swap account
                </span>
              </div>
              <SwapIcon></SwapIcon>
            </Col>
            <Col
              className={classNames(
                this.state.styles.asset,
                'text-format-title-light',
                'px-0',
              )}
            >
              <div className={this.state.styles.assetText}>
                <span>To</span> <DestAsset></DestAsset>
              </div>
            </Col>
          </Row>
        </Container>
      </Card.Header>
    )
  }
}

WarpChainTitle.propTypes = {
  isToEvrynet: PropTypes.bool.isRequired,
  toggleTransferSwitch: PropTypes.func.isRequired,
}
