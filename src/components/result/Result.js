import React, { useState } from 'react'
import { Card, Container, Row, Col, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { useGetPageTypeItems } from 'Components/result/resultHooks'
import 'Components/result/result.scss'
import classNames from 'classnames'
import { toCurrency } from '@/utils/format'
import { CopyToClipboard } from 'react-copy-to-clipboard'

const Result = (props) => {
  const [stylesMain] = useState('Result')
  const {
    amount,
    asset: { code, decimal },
    src,
    dest,
    txHashes,
    removeResult,
  } = props
  const { items } = useGetPageTypeItems(props)
  const SrcIcon = items.chain.src
  const DestIcon = items.chain.dest

  return (
    <Container className={classNames(stylesMain, 'p-0')}>
      <Row>
        <Col className={`${stylesMain}__content`}>
          <Card className={`${stylesMain}__content__card`}>
            <Card.Body className="p-0">
              <div
                className={classNames({
                  [`${stylesMain}__content__body`]: true,
                })}
              >
                <Container className="p-0">
                  <Row
                    className={classNames(
                      'm-0',
                      `${stylesMain}__content__body__row`,
                    )}
                  >
                    <Col
                      className={classNames(
                        `${stylesMain}__content__body__status`,
                      )}
                    >
                      <span>{items.title}</span>
                    </Col>
                  </Row>
                  <Row
                    className={classNames(
                      'm-0',
                      `${stylesMain}__content__body__row`,
                      'justify-content-start',
                    )}
                  >
                    <Col
                      className={classNames({
                        [`${stylesMain}__content__body__title`]: true,
                      })}
                    >
                      <span
                        className={classNames(
                          'label--dark',
                          'text-format-title',
                          `${stylesMain}__content__body__title__text`,
                        )}
                      >
                        From
                      </span>
                      <SrcIcon></SrcIcon>
                    </Col>
                    <Col
                      className={classNames(
                        `${stylesMain}__content__body__title`,
                        'text-right',
                      )}
                    >
                      <span
                        className={classNames(
                          'label--dark',
                          'text-format-title',
                          `${stylesMain}__content__body__title__text`,
                        )}
                      >
                        To
                      </span>
                      <DestIcon></DestIcon>
                    </Col>
                  </Row>
                  <Row
                    className={classNames(
                      'm-0',
                      `${stylesMain}__content__body__row`,
                      'justify-content-start',
                    )}
                  >
                    <Col
                      className={classNames({
                        [`${stylesMain}__content__body__account`]: true,
                      })}
                    >
                      <div className="text-left ellipsis">
                        <span
                          className={classNames(
                            `${stylesMain}__content__body__account__text`,
                            'text-format-input',
                          )}
                        >
                          {src}
                        </span>
                      </div>
                    </Col>
                    <Col className={`${stylesMain}__content__body__swap`}>
                      <i className="fas fa-arrow-right"></i>
                    </Col>
                    <Col
                      className={classNames({
                        [`${stylesMain}__content__body__account`]: true,
                      })}
                    >
                      <div className="text-right ellipsis">
                        <span
                          className={classNames(
                            `${stylesMain}__content__body__account__text`,
                            'text-format-input',
                          )}
                        >
                          {dest}
                        </span>
                      </div>
                    </Col>
                  </Row>
                  <Row
                    className={classNames(
                      'm-0',
                      `${stylesMain}__content__body__row`,
                      'justify-content-start',
                    )}
                  >
                    <Col
                      className={classNames({
                        [`${stylesMain}__content__body__title`]: true,
                      })}
                    >
                      <span
                        className={classNames(
                          'label--dark',
                          'text-format-title',
                          `${stylesMain}__content__body__title__text`,
                        )}
                      >
                        Amount
                      </span>
                    </Col>
                  </Row>
                  <Row
                    className={classNames(
                      'm-0',
                      `${stylesMain}__content__body__row`,
                    )}
                  >
                    <Col
                      className={classNames(
                        `${stylesMain}__content__body__amount`,
                        'text-format-title-bold',
                      )}
                    >
                      <span>{`${toCurrency(amount, decimal)} ${code}`}</span>
                    </Col>
                  </Row>
                  <hr />
                  <Row
                    className={classNames(
                      'm-0',
                      `${stylesMain}__content__body__row`,
                    )}
                  >
                    <Col
                      className={classNames({
                        [`${stylesMain}__content__hash`]: true,
                      })}
                    >
                      <Card>
                        <Card.Body
                          className={classNames({
                            [`${stylesMain}__content__hash__content`]: true,
                          })}
                        >
                          <span
                            className={classNames(
                              'text-format-label',
                              'd-block',
                            )}
                          >
                            For Stellar
                          </span>
                          <Container className="m-0">
                            <Row className="p-0 justify-content-between">
                              <Col>
                                <span
                                  className={classNames('text-format-input')}
                                >
                                  {txHashes.state.stellar}
                                </span>
                              </Col>
                              <Col className="text-right">
                                <CopyToClipboard text={txHashes.state.stellar}>
                                  <Button>Copy</Button>
                                </CopyToClipboard>
                              </Col>
                            </Row>
                          </Container>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                  <Row
                    className={classNames(
                      'm-0',
                      `${stylesMain}__content__body__row`,
                    )}
                  >
                    <Col
                      className={classNames({
                        [`${stylesMain}__content__hash`]: true,
                      })}
                    >
                      <Card>
                        <Card.Body
                          className={classNames({
                            [`${stylesMain}__content__hash__content`]: true,
                          })}
                        >
                          <span
                            className={classNames(
                              'text-format-label',
                              'd-block',
                            )}
                          >
                            For E^vrynet
                          </span>
                          <Container className="m-0">
                            <Row className="p-0 justify-content-between">
                              <Col>
                                <span
                                  className={classNames('text-format-input')}
                                >
                                  {txHashes.state.evrynet}
                                </span>
                              </Col>
                              <Col className="text-right">
                                <CopyToClipboard text={txHashes.state.evrynet}>
                                  <Button>Copy</Button>
                                </CopyToClipboard>
                              </Col>
                            </Row>
                          </Container>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                  <Row
                    className={classNames(
                      'm-0',
                      `${stylesMain}__content__body__row`,
                    )}
                  >
                    <Col className={`${stylesMain}__close`}>
                      <Button
                        onClick={() => {
                          removeResult()
                        }}
                        variant="secondary"
                        className={classNames(`${stylesMain}__close__btn`)}
                      >
                        Done
                      </Button>
                    </Col>
                  </Row>
                </Container>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

Result.propTypes = {
  push: PropTypes.func.isRequired,
  amount: PropTypes.string.isRequired,
  asset: PropTypes.shape({
    code: PropTypes.string,
    decimal: PropTypes.number,
  }).isRequired,
  src: PropTypes.string.isRequired,
  dest: PropTypes.string.isRequired,
  txHashes: PropTypes.shape({
    state: PropTypes.shape({
      stellar: PropTypes.string,
      evrynet: PropTypes.string,
    }),
    error: PropTypes.object,
  }).isRequired,
  removeResult: PropTypes.func.isRequired,
  isToEvrynet: PropTypes.bool.isRequired,
}

export default Result
