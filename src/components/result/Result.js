import React from 'react'
import { Card, Container, Row, Col, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'

const Result = (props) => {
  return (
    <Container>
      <Row>
        <Col>
          <Card>
            <Card.Body></Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button
            onClick={() => {
              props.push('/')
            }}
          >
            Back to Home Page
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

Result.propTypes = {
  push: PropTypes.func.isRequired,
}

export default Result
