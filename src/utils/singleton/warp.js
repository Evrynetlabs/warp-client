import Warp, { WarpConfig, initWarpConfig } from '@Evrynetlabs/warp-js'
let warpInstance

export default function getWarpInstance() {
  if (!warpInstance) {
    let config = new WarpConfig()
    if (process.env.WARP_NATIVE_ASSET_CUSTODIAN_ADDRESS) {
      config.evrynet.contract.nativeCustodian.address =
        process.env.WARP_NATIVE_ASSET_CUSTODIAN_ADDRESS
    }
    if (process.env.WARP_STELLAR_CREDIT_CUSTODIAN_ADDRESS) {
      config.evrynet.contract.stellarCustodian.address =
        process.env.WARP_STELLAR_CREDIT_CUSTODIAN_ADDRESS
    }
    if (process.env.WARP_GRPC_HOST) {
      config.grpc.host = process.env.WARP_GRPC_HOST
    }
    if (process.env.WARP_HTTP_PROVIDER_HOST) {
      config.evrynet.provider = process.env.WARP_HTTP_PROVIDER_HOST
    }
    initWarpConfig(config)
    warpInstance = new Warp()
  }
  return warpInstance
}
