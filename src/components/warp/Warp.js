import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import classNames from 'classnames'
import WarpAssetTitle from 'Components/warp/warp-asset-title/WarpAssetTitle'
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
              <WarpAssetTitle></WarpAssetTitle>
              <WarpContent
                collectTxHashesData={this.props.collectTxHashesData}
                collectTxHashesPending={this.props.collectTxHashesPending}
                collectTxHashesError={this.props.collectTxHashesError}
                toEvry={this.props.toEvry}
              ></WarpContent>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }
}

Warp.propTypes = {
  collectTxHashesData: PropTypes.shape({
    stellar: PropTypes.string,
    evry: PropTypes.string,
  }),
  collectTxHashesPending: PropTypes.bool,
  collectTxHashesError: PropTypes.object,
  toEvry: PropTypes.func.isRequired,
}
