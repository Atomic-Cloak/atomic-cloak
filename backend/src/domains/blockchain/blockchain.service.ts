import { ethers } from 'ethers'
import { atomicCloakABI, rpcProviders } from '../../constants'

export const getAtomicCloakContract = async (chainId) => {
  const contractAddresses = {
    11155111: process.env.ATOMIC_CLOAK_ADDRESS_SEPOLIA,
    80001: process.env.ATOMIC_CLOAK_ADDRESS_MUMBAI,
    420: process.env.ATOMIC_CLOAK_ADDRESS_OPTIMISM_GOERLI,
    5001: process.env.ATOMIC_CLOAK_ADDRESS_MANTLE,
    280: process.env.ATOMIC_CLOAK_ADDRESS_ZKSYNC,
    167005: process.env.ATOMIC_CLOAK_ADDRESS_TAIKO
  }

  const provider = new ethers.providers.JsonRpcProvider(rpcProviders[chainId])
  const wallet = new ethers.Wallet(
    process.env.BACKEND_PRIVATE_KEY ?? '',
    provider
  )
  const signer = wallet.connect(provider)
  const atomicCloak = new ethers.Contract(
    contractAddresses[chainId],
    atomicCloakABI,
    signer
  )
  console.log('BALANCE: ', await signer.getBalance())
  return { provider, signer, atomicCloak }
}
