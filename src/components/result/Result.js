import React from 'react'
import { Card, Container, Row, Col, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import {
  useInitStyles,
  useSourceDestinationType,
} from 'Components/result/resultHooks'
import 'Components/result/result.scss'
import classNames from 'classnames'
import { toCurrency } from '@/utils/format'

const Result = (props) => {
  const { styles } = useInitStyles()
  const { chain } = useSourceDestinationType(props.location.state.isToEvrynet)
  const {
    amount,
    asset: { code, decimal },
    src,
    dest,
  } = props.location.state
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
                      <h1>{`${toCurrency(amount, decimal)} ${code}`}</h1>
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
                                <span>{chain.src}</span>
                              </Row>
                              <Row>
                                <span className={styles.accountText}>
                                  Account Number: {src}
                                </span>
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
                                <span>{chain.dest}</span>
                              </Row>
                              <Row>
                                <span className={styles.accountText}>
                                  Account Number: {dest}
                                </span>
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
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
}

export default Result
