import React, { useState, useEffect } from 'react'
import uuiv4 from 'uuid/v4'
import PropTypes from 'prop-types'
import Modal from 'react-modal'
import { Spinner } from 'react-bootstrap'
import 'Components/hoc/loading/loading.scss'

export default function withLoading(Component) {
  const Loading = (props) => {
    const [loadingID] = useState(uuiv4())
    const [isLoading, setIsLoading] = useState(false)
    const [styles] = useState(_initStyles())
    const { loadingObjs, startLoading, stopLoading } = props

    function _initStyles() {
      const main = 'Loading'
      const overlay = `${main}__overlay`
      const item = `${main}__item`
      return {
        main,
        overlay,
        item,
      }
    }

    function handleStartLoading() {
      startLoading(loadingID)
    }

    function handleStopLoading() {
      stopLoading(loadingID)
    }

    useEffect(() => {
      const loadingObj = loadingObjs[loadingID]
      if (loadingObj && loadingObj.isLoading) {
        setIsLoading(true)
        return
      }
      setIsLoading(false)
    }, [loadingObjs])

    const childProps = {
      startLoading: handleStartLoading,
      stopLoading: handleStopLoading,
    }

    return (
      <React.Fragment>
        <Component {...props} {...childProps}></Component>
        <Modal
          isOpen={isLoading}
          overlayClassName={styles.overlay}
          className={styles.item}
        >
          <div className="text-center">
            <span className="d-block pb-4 text-format-small">
              processing...
            </span>
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div>
        </Modal>
      </React.Fragment>
    )
  }

  Loading.propTypes = {
    startLoading: PropTypes.func.isRequired,
    stopLoading: PropTypes.func.isRequired,
    loadingObjs: PropTypes.objectOf(
      PropTypes.shape({
        isLoading: PropTypes.bool,
      }),
    ),
  }
  return Loading
}
