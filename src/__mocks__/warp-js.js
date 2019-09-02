// __mocks__/warp-js.js

// Import this named export into your test file
// const originalWarp = jest.requireActual('warp-js')
// const original = new originalWarp()
export const spyToEvrynet = jest.fn()
export const spyGetWhitelistAssets = jest.fn()
const mock = jest.fn().mockImplementation(() => {
  return {
    toEvrynet: spyToEvrynet,
    client: {
      evry: {
        getWhitelistAssets: spyGetWhitelistAssets,
      },
    },
  }
  // Now we can track calls to playSoundFile
})
export default mock
