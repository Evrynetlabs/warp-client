import React from 'react'
import { Card, Container, Row, Col, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { useInitStyles } from 'Components/result/resultHooks'
import 'Components/result/result.scss'
import classNames from 'classnames'

const Result = (props) => {
  const { styles } = useInitStyles()

  return (
    <Container className={styles.main}>
      <Row>
        <Col className={styles.content}>
          <Card>
            <Card.Title>
              <div
                className={classNames({
                  'text-center': true,
                  [styles.title]: true,
                })}
              >
                <i className="fas fa-check-circle"></i>
              </div>
            </Card.Title>
            <Card.Body className="p-0">
              <div
                className={classNames({
                  [styles.body]: true,
                })}
              >
                <Container>
                  <Row>
                    <Col
                      className={classNames({
                        [styles.amount]: true,
                      })}
                    >
                      <h1>200,000 vTHB</h1>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      className={classNames({
                        [styles.status]: true,
                      })}
                    >
                      <h4>TRANSACTION CONFIRMED</h4>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      xs="5"
                      className={classNames({
                        [styles.account]: true,
                      })}
                    >
                      <div className="text-left">
                        <span className="label--dark">From</span>
                        <Card>
                          <Card.Body>
                            <Container>
                              <Row>
                                <span>Stellar</span>
                              </Row>
                              <Row>
                                <span>Account Number: 12312313213</span>
                              </Row>
                            </Container>
                          </Card.Body>
                        </Card>
                      </div>
                    </Col>
                    <Col className={styles.swap}>
                      <i className="fas fa-arrow-right"></i>
                    </Col>
                    <Col
                      xs="5"
                      className={classNames({
                        [styles.account]: true,
                      })}
                    >
                      <div className="text-left">
                        <span className="label--dark">To</span>
                        <Card>
                          <Card.Body>
                            <Container>
                              <Row>
                                <span>Evrynet</span>
                              </Row>
                              <Row>
                                <span>Account Number: 12312313213</span>
                              </Row>
                            </Container>
                          </Card.Body>
                        </Card>
                      </div>
                    </Col>
                  </Row>
                </Container>
              </div>
            </Card.Body>
            <Card.Footer>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Tincidunt ornare massa eget egestas purus viverra accumsan in.
                Tempor nec feugiat nisl pretium fusce. Id porta nibh venenatis
                cras sed felis eget. In iaculis
              </p>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col className={styles.footer}>
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
