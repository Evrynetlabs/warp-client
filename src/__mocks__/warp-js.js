// __mocks__/warp-js.js

export const spyToEvrynet = jest.fn()
export const spyToStellar = jest.fn()
export const spyGetWhitelistAssets = jest.fn()
export const spyGetCode = jest.fn()
export const spyGetAccountBalance = jest.fn()
export const spyGetPublickeyFromPrivateKey = jest.fn()
const mock = jest.fn().mockImplementation(() => {
  return {
    toEvrynet: spyToEvrynet,
    toStellar: spyToStellar,
    client: {
      evry: {
        getWhitelistAssets: spyGetWhitelistAssets,
        getAccountBalance: spyGetAccountBalance,
        getPublickeyFromPrivateKey: spyGetPublickeyFromPrivateKey,
      },
      stellar: {
        getAccountBalance: spyGetAccountBalance,
        getPublickeyFromPrivateKey: spyGetPublickeyFromPrivateKey,
      },
    },
    utils: {
      getEvryAsset: jest.fn().mockReturnValue({
        getCode: spyGetCode,
      }),
    },
  }
})
export default mock
