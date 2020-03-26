import React, { useState, forwardRef } from 'react'
import { Form, Button, Container, Row, Col } from 'react-bootstrap'
import classNames from 'classnames'
import PropTypes from 'prop-types'

const MaskPasswordInput = forwardRef(function MaskPasswordInput(
  props,
  forwardedRef,
) {
  const [isMasked, setIsMasked] = useState(true)
  const stylesMain = MaskPasswordInput.name

  const toggleIsMasked = () => {
    setIsMasked(!isMasked)
  }

  const { maskiconprops } = props

  return (
    <Container className="p-0">
      <Row className="m-0 p-0">
        <Col className={classNames('p-0', `${stylesMain}__input`)}>
          <Form.Control
            ref={forwardedRef}
            {...props}
            type={isMasked ? 'password' : 'text'}
          ></Form.Control>
        </Col>
        <Col className={classNames('p-0', `${stylesMain}__mask`)}>
          <Button
            {...maskiconprops}
            variant=""
            className={classNames(`${stylesMain}__mask__btn`)}
            onClick={() => {
              toggleIsMasked()
            }}
          >
            <i
              className={classNames(
                'fas',
                `fa-eye${isMasked ? '-slash' : ''}`,
                classNames(`text-white`),
              )}
            ></i>
          </Button>
        </Col>
      </Row>
    </Container>
  )
})

MaskPasswordInput.displayName = 'MaskPasswordInput'

MaskPasswordInput.defaultProps = {
  maskiconprops: {},
}

MaskPasswordInput.propTypes = {
  maskiconprops: PropTypes.object,
}

export default MaskPasswordInput
