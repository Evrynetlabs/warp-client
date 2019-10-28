import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-modal'
import { Spinner } from 'react-bootstrap'
import 'Components/hoc/loading/loading.scss'

export default function withLoading(Component) {
  const Loading = (props) => {
    const [styleMain] = useState('Loading')
    const { isLoading, startLoading, stopLoading } = props

    function handleStartLoading() {
      startLoading()
    }

    function handleStopLoading() {
      stopLoading()
    }

    const childProps = {
      startLoading: handleStartLoading,
      stopLoading: handleStopLoading,
    }

    return (
      <React.Fragment>
        <Component {...props} {...childProps}></Component>
        <Modal
          isOpen={isLoading}
          overlayClassName={`${styleMain}__overlay`}
          className={`${styleMain}__item`}
        >
          <div className="text-center">
            <span className="d-block pb-4 text-format-small">
              processing...
            </span>
            <Spinner animation="border" role="status"></Spinner>
          </div>
        </Modal>
      </React.Fragment>
    )
  }

  Loading.propTypes = {
    startLoading: PropTypes.func.isRequired,
    stopLoading: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
  }
  return Loading
}
