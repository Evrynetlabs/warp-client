import React from 'react'
import HealthCheckRoute from 'Components/healthcheck/HealthCheck'
import { MemoryRouter, Route } from 'react-router-dom'
import { mount } from 'enzyme'

let mutualProps

describe('HealthCheck', () => {
  beforeEach(() => {
    const MockCorrectPage = () => <div className="msg">correct page</div>
    mutualProps = {
      healthCheck: {
        state: false,
        loading: false,
        error: null,
      },
      component: MockCorrectPage,
      doHealthCheck: jest.fn(),
    }
  })

  describe('When healthcheck returns 200', () => {
    it('should return the correct page', () => {
      const props = {
        ...mutualProps,
        healthCheck: {
          ...mutualProps.healthCheck,
          state: true,
        },
      }
      const MockHealthCheckRoute = (props) => (
        <div>
          <HealthCheckRoute exact path="/" {...props} />
          <Route
            path="/500"
            render={() => <div className="msg">this is a 500 error</div>}
          />
        </div>
      )
      const wrapper = mount(
        <MemoryRouter initialEntries={['/']}>
          <MockHealthCheckRoute {...props}></MockHealthCheckRoute>
        </MemoryRouter>,
      )
      expect(wrapper.find('.msg').text()).toBe('correct page')
    })
  })

  describe('When healthcheck returns 500', () => {
    it('should return the correct page', () => {
      const props = {
        ...mutualProps,
        healthCheck: {
          ...mutualProps.healthCheck,
          state: false,
        },
      }
      const wrapper = mount(
        <MemoryRouter initialEntries={['/']}>
          <HealthCheckRoute exact path="/" {...props} />
        </MemoryRouter>,
      )
      expect(wrapper.find('div.ErrorPage__content__message').text()).toBe(
        '500 Internal Server ErrorPlease try again later.',
      )
    })
  })
})
