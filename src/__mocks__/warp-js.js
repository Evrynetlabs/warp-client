// __mocks__/warp-js.js

// Import this named export into your test file
export const spyToEvrynet = jest.fn()
const mock = jest.fn().mockImplementation(() => {
  return {
    toEvrynet: spyToEvrynet,
    client: jest.fn().mockReturnValue({
      evry: jest.fn().mockReturnValue({
        getWhitelistAssets: jest.fn(),
      }),
    }),
  }
  // Now we can track calls to playSoundFile
})
export default mock
