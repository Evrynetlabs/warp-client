import React from 'react'
import { shallow } from 'enzyme'
import Result from 'Components/result/Result.js'

describe('Result', () => {
  const mockSuccessHashes = {
    state: {
      stellar: 'foo',
      evrynet: 'bar',
    },
    error: null,
  }
  const mockFailedHashes = {
    state: null,
    error: new Error('this is an error'),
  }
  const mock = {
    push: jest.fn(),
    match: {},
    location: {
      state: {
        isToEvrynet: true,
        amount: '1000',
        asset: { code: 'EVRY', decimal: 7 },
        src: 'foo',
        dest: 'bar',
      },
    },
    history: {},
  }

  describe('When the transfer process is success', () => {
    describe('When isToEverynet', () => {
      it('should render correspondingly', () => {
        const component = shallow(
          <Result
            push={mock.push}
            match={mock.match}
            location={{
              state: {
                ...mock.location.state,
                txHashes: mockSuccessHashes,
              },
            }}
            history={mock.history}
          ></Result>,
        )
        expect(component).toMatchSnapshot()
      })
    })

    describe('When isToStellar', () => {
      it('should render correspondingly', () => {
        const component = shallow(
          <Result
            push={mock.push}
            match={mock.match}
            location={{
              state: {
                ...mock.location.state,
                txHashes: mockSuccessHashes,
              },
            }}
            history={mock.history}
          ></Result>,
        )
        expect(component).toMatchSnapshot()
      })
    })
  })

  describe('When the transfer process is failed', () => {
    describe('When isToEverynet', () => {
      it('should render correspondingly', () => {
        const component = shallow(
          <Result
            push={mock.push}
            match={mock.match}
            location={{
              state: {
                ...mock.location.state,
                txHashes: mockFailedHashes,
              },
            }}
            history={mock.history}
          ></Result>,
        )
        expect(component).toMatchSnapshot()
      })
    })

    describe('When isToStellar', () => {
      it('should render correspondingly', () => {
        const component = shallow(
          <Result
            push={mock.push}
            match={mock.match}
            location={{
              state: {
                ...mock.location.state,
                txHashes: mockFailedHashes,
              },
            }}
            history={mock.history}
          ></Result>,
        )
        expect(component).toMatchSnapshot()
      })
    })
  })
})
