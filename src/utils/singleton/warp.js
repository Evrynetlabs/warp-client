import Warp, { WarpConfig, initWarpConfig } from 'warp-js'
let warpInstance

export default function getWarpInstance() {
  if (!warpInstance) {
    let config = new WarpConfig()
    if (process.env.WARP_ADDRESS) {
      config.evrynet.contract.stellarCustodian = process.env.WARP_ADDRESS
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
