import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import { OpenSeaPort, Network } from 'opensea-js'
const RPCSubprovider = require("web3-provider-engine/subproviders/rpc");
const Web3ProviderEngine = require("web3-provider-engine");
// import { create } from 'ipfs-core'

const NETWORK = process.env.VUE_APP_NETWORK || 'mainnet'
const isInfura = !!process.env.VUE_APP_INFURA_KEY
const NODE_API_KEY = process.env.VUE_APP_INFURA_KEY || process.env.VUE_APP_ALCHEMY_KEY


export const mutations = {
  setLoading(state, loading) {
    state.loading = loading
  }
};

export const actions = {
  async getProvider() {

    const network = NETWORK === "mainnet" || NETWORK === "live" ? "mainnet" : "rinkeby";
    const infuraRpcSubprovider = new RPCSubprovider({
      rpcUrl: isInfura
        ? "https://" + network + ".infura.io/v3/" + NODE_API_KEY
        : "https://eth-" + network + ".alchemyapi.io/v2/" + NODE_API_KEY,
    });

    // IPFS
    // ipfs.value = await create()
    // const { agentVersion, id } = await ipfs.value.id()
    // console.log(agentVersion, id, ipfs.value.isOnline())
    
    const providerEngine = new Web3ProviderEngine()
    providerEngine.addProvider(infuraRpcSubprovider)
    

    return providerEngine
  },
  async getMarketplace({ dispatch }, market) {
    const provider = await dispatch('getProvider')

    provider.start()

    let marketplace = null

    if (market == 'opensea') {
      marketplace = new OpenSeaPort(
        provider, 
        {
          networkName: NETWORK === "mainnet" || NETWORK === "live"
          ? Network.Main
          : Network.Rinkeby,
          apiKey: ""
        },
        (arg) => console.log('arg', arg)
      )
    }
    
    return marketplace
  },
  async getNft({ dispatch }, url) {

    // check the marketplace url
    // is opensea
    if (url.startsWith("https://opensea.io/")) {
      // get marketplace
      const marketplace = await dispatch('getMarketplace', 'opensea')
      // use opensea
      const asset = await dispatch('getAssetFromOpensea', { marketplace, url })
      return asset
    } else {
      // show an error message
      return { status: 'error', msg: "Invalid marketplace url" }
    }
  },
  async getAssetFromOpensea(_, { marketplace, url }) {
    
    const splittedUrl = url.split("/")

    if (splittedUrl.length == 6) {
      // get the asset contract address
      const tokenAddress = splittedUrl[4]
      // get the asset id from the url
      const tokenId = splittedUrl[5]

      console.log(`Asset contract address: ${tokenAddress}`)
      console.log(`Asset id: ${tokenId}`)

      // get asset from opensea
      const asset = await marketplace.api.getAsset({tokenAddress, tokenId})

      console.log('Asset original url', asset.imageUrlOriginal)

      // check url is image
      if (!asset.imageUrlOriginal.match(/\.(jpeg|jpg|gif|png)$/)) {
        return { status: 'error', msg: "Please enter a valid image url" }
      }

      let assetUrl = null
      // if asset.imageUrlOriginal is from ipfs - no CORS needed
      if (asset.imageUrlOriginal.search("ipfs") > -1) {
        assetUrl = asset.imageUrlOriginal
      } else {
        assetUrl = asset.imageUrl
      }

      return { assetUrl, tokenAddress, tokenId }
    } else {
      return { status: 'error', msg: "Invalid asset url" }
    }
  }
};

export default createStore({
  state: {
    loading: false
  },
  mutations,
  actions,
  plugins: [createPersistedState({
    key: 'getyournft'
  })], // persist state
});
