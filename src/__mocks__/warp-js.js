// __mocks__/warp-js.js

// Import this named export into your test file
// const originalWarp = jest.requireActual('warp-js')
// const original = new originalWarp()
export const spyToEvrynet = jest.fn()
export const spyToStellar = jest.fn()
export const spyGetWhitelistAssets = jest.fn()
export const spyGetCode = jest.fn()
const mock = jest.fn().mockImplementation(() => {
  return {
    toEvrynet: spyToEvrynet,
    toStellar: spyToStellar,
    client: {
      evry: {
        getWhitelistAssets: spyGetWhitelistAssets,
      },
    },
    utils: {
      getEvryAsset: jest.fn().mockReturnValue({
        getCode: spyGetCode,
      }),
    },
  }
  // Now we can track calls to playSoundFile
})
export default mock
