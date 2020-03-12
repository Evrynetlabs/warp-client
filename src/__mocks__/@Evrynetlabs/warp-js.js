export const spyToEvrynet = jest.fn()
export const spyToStellar = jest.fn()
export const spyGetWhitelistAssets = jest.fn()
export const spyGetCode = jest.fn()
export const spyGetAccountBalance = jest.fn()
export const spyGetPublickeyFromPrivateKey = jest.fn()
export const spyGetTrustlines = jest.fn()
export const spyIsListening = jest.fn()
const mock = jest.fn().mockImplementation(() => {
  return {
    toEvrynet: spyToEvrynet,
    toStellar: spyToStellar,
    client: {
      evry: {
        getWhitelistAssets: spyGetWhitelistAssets,
        getBalance: spyGetAccountBalance,
        getPublickeyFromPrivateKey: spyGetPublickeyFromPrivateKey,
      },
      stellar: {
        getBalance: spyGetAccountBalance,
        getPublickeyFromPrivateKey: spyGetPublickeyFromPrivateKey,
        getTrustlines: spyGetTrustlines,
      },
      net: {
        isListening: spyIsListening,
      },
    },
    utils: {
      getEvryAsset: jest.fn().mockReturnValue({
        getCode: spyGetCode,
      }),
    },
  }
})
export const WarpConfig = jest.fn()
export const initWarpConfig = jest.fn()
export default mock