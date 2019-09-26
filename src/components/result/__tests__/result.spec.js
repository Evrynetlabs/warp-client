import React from 'react'
import { shallow } from 'enzyme'
import Result from 'Components/result/Result.js'

describe('Result', () => {
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
        txHashes: {
          stellar: 'foo',
          evrynet: 'bar',
        },
      },
    },
    history: {},
  }
  let component

  beforeAll(() => {
    jest.spyOn(React, 'useEffect').mockImplementation(React.useLayoutEffect)
  })

  beforeEach(() => {
    component = shallow(
      <Result
        push={mock.push}
        match={mock.match}
        location={mock.location}
        history={mock.history}
      ></Result>,
    )
  })
  describe('When isToEverynet', () => {
    it('should render correspondingly', () => {
      expect(component).toMatchSnapshot()
    })
  })

  describe('When isToStellar', () => {
    it('should render correspondingly', () => {
      expect(component).toMatchSnapshot()
    })
  })
})
