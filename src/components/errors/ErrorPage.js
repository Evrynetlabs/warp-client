import React from 'react'
import classNames from 'classnames'
import { Container, Row, Col } from 'react-bootstrap'
import { ReactComponent as Logo } from '@/assets/icons/logo.svg'
import { ReactComponent as InternalLogo } from '@/assets/icons/internal_500.svg'

export default function ErrorPage() {
  const stylesMain = ErrorPage.name
  return (
    <Container fluid className={classNames(stylesMain, 'p-0')}>
      <Row>
        <Col className={classNames(`${stylesMain}__icon`, 'text-center')}>
          <Logo></Logo>
        </Col>
      </Row>
      <Row>
        <Col className={classNames(`${stylesMain}__content`, 'text-center')}>
          <Container fluid>
            <Row className={classNames('justify-content-center')}>
              <Col
                className={classNames(`${stylesMain}__content__logo`, 'p-0')}
              >
                <InternalLogo></InternalLogo>
              </Col>
              <Col
                className={classNames(`${stylesMain}__content__message`, 'p-0')}
              >
                <div
                  className={classNames('text-format-title', 'text-secondary')}
                >
                  500 Internal Server Error
                </div>
                <div className={classNames('text-format-label')}>
                  Please try again later.
                </div>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  )
}
