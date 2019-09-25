import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import classNames from 'classnames'
import WarpChainTitle from 'Components/warp/warp-chain-title/WarpChainTitle'
import WarpContent from 'Components/warp/warp-content/WarpContent'
import { Container, Row, Col } from 'react-bootstrap'
import PropTypes from 'prop-types'
import 'Components/warp/warp.scss'

export default class Warp extends Component {
  constructor(props) {
    super(props)
    this.stylesMain = classNames({
      [this.constructor.name]: true,
    })
    this.stylesContent = `${this.stylesMain}__content`
    this.state = {
      styles: {
        main: this.stylesMain,
        content: this.stylesContent,
      },
    }
  }

  render() {
    return (
      <Container fluid className={this.state.styles.main}>
        <Row>
          <Col>
            <Card className={this.state.styles.content}>
              <WarpChainTitle
                toggleTransferSwitch={this.props.toggleTransferSwitch}
                isToEvrynet={this.props.isToEvrynet}
              ></WarpChainTitle>
              <WarpContent
                txHashes={this.props.txHashes}
                toEvrynet={this.props.toEvrynet}
                toStellar={this.props.toStellar}
                whitelistedAssets={this.props.whitelistedAssets}
                getWhitelistAssets={this.props.getWhitelistAssets}
                isToEvrynet={this.props.isToEvrynet}
                getAccountBalance={this.props.getAccountBalance}
                accountBalance={this.props.accountBalance}
                getTrustlines={this.props.getTrustlines}
                trustlines={this.props.trustlines}
              ></WarpContent>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }
}

Warp.propTypes = {
  txHashes: PropTypes.shape({
    state: PropTypes.shape({
      stellar: PropTypes.string,
      evry: PropTypes.string,
    }),
    loading: PropTypes.bool,
    error: PropTypes.object,
  }).isRequired,
  whitelistedAssets: PropTypes.shape({
    state: PropTypes.array,
    loading: PropTypes.bool,
    error: PropTypes.object,
  }).isRequired,
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
  isToEvrynet: PropTypes.bool.isRequired,
  toEvrynet: PropTypes.func.isRequired,
  toStellar: PropTypes.func.isRequired,
  getWhitelistAssets: PropTypes.func.isRequired,
  toggleTransferSwitch: PropTypes.func.isRequired,
  getAccountBalance: PropTypes.func.isRequired,
  getTrustlines: PropTypes.func.isRequired,
}
