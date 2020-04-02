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
    if (process.env.WARP_EVRYNET_CREDIT_CUSTODIAN_ADDRESS) {
      config.evrynet.contract.evrynetCustodian.address =
        process.env.WARP_EVRYNET_CREDIT_CUSTODIAN_ADDRESS
    }
    if (process.env.WARP_GRPC_HOST) {
      config.grpc.host = process.env.WARP_GRPC_HOST
    }
    if (process.env.WARP_HTTP_PROVIDER_HOST) {
      config.evrynet.provider = process.env.WARP_HTTP_PROVIDER_HOST
    }
    if (process.env.WARP_STELLAR_ESCROW_ACCOUNT) {
      config.stellar.escrowAccount = process.env.WARP_STELLAR_ESCROW_ACCOUNT
    }
    if (process.env.WARP_STELLAR_ISSUER) {
      config.stellar.issuer = process.env.WARP_STELLAR_ISSUER
    }
    if (process.env.WARP_STELLAR_NETWORK) {
      config.stellar.network = process.env.WARP_STELLAR_NETWORK
    }
    initWarpConfig(config)
    warpInstance = new Warp()
  }
  return warpInstance
}
