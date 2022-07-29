import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress, whitelistAddress,allowlistAddress} from "./constants1.js"


console.log("ethers", ethers)
console.log("MerkleTree", window.MerkleTree)
console.log("keccak256", window.keccak256)
const leafNodesWl = whitelistAddress.map((addr) => keccak256(addr));
const merkleTreeWl = new MerkleTree(leafNodesWl, keccak256, { sortPairs: true });
const roothash = merkleTreeWl.getRoot();

const leafNodesAllowlist = allowlistAddress.map((addr) => keccak256(addr));
const  merkleTreeAllowlist = new MerkleTree(leafNodesWl, keccak256, { sortPairs: true });
const roothashAllowlist = merkleTreeAllowlist.getRoot();

const connectButton = document.getElementById("connectButton")
const mintWlButton = document.getElementById("whitelist_mint")
const mintAllowlistButton = document.getElementById("allowlist_mint")
const mintPublicButton = document.getElementById("public_mint")
connectButton.onclick = connect
mintWlButton.onclick = mintWl

const targetNetworkId = '0x1';
async function checkNetwork (){
  if (window.ethereum) {
    const currentChainId = await ethereum.request({ method: "eth_chainId" })
    if (currentChainId == targetNetworkId){ 
      return true
    }else{
    return false}
  }
};
async function switchNetwork(){
    await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: targetNetworkId }],
  });
  window.location.reload();
};

async function connect() {
    if (typeof window.ethereum !== "undefined") {
      try {
        await ethereum.request({ method: "eth_requestAccounts" })
      } catch (error) {
        console.log(error)
      }
      connectButton.innerHTML = "Connected"
      const accounts = await ethereum.request({ method: "eth_accounts" })
      console.log(accounts)
    } else {
      connectButton.innerHTML = "Please install MetaMask"
    }
  }
    async function mintWl() {
     const provider = new ethers.providers.Web3Provider(window.ethereum)
     const signer = provider.getSigner()
     const contract = new ethers.Contract(contractAddress, abi, signer)
     const transactionResponse = await contract.symbol()
     console.log(transactionResponse)
     if(await window.ethereum.request({ method: 'eth_chainId'}) != '0x1'){
       await window.ethereum.request({method: 'wallet_switchEthereumChain', params: [{ chainId: targetNetworkId }] })
     const provider = new ethers.providers.Web3Provider(window.ethereum)
     const signer = provider.getSigner()
     const claimingddress =  keccak256(await signer.getAddress())
     const proof = await merkleTreeWl.getHexProof(claimingddress)
     const contract = new ethers.Contract(contractAddress, abi, signer)
     const transactionResponse = await contract.mintWl(proof)
     }else
            {const provider = new ethers.providers.Web3Provider(window.ethereum)
             const signer = provider.getSigner()
             const claimingddress =  keccak256(await signer.getAddress())
             const proof = await merkleTreeWl.getHexProof(claimingddress)
             const contract = new ethers.Contract(contractAddress, abi, signer)
             const transactionResponse = await contract.mintWl(proof)}          
    }
      

    async function mintAllowlist() {
       if(await window.ethereum.request({ method: 'eth_chainId'}) != '0x1'){
       await window.ethereum.request({
             method: 'wallet_switchEthereumChain',
             params: [{ chainId: targetNetworkId }]})
              const amount = document.getElementById("mintAmountAllowlist").value
              const v = amount *9000000000000000
              const provider = new ethers.providers.Web3Provider(window.ethereum)
              const signer = provider.getSigner()
              const claimingddress =  keccak256(await signer.getAddress())
              const proof = await  merkleTreeAllowlist.getHexProof(claimingddress)
              const contract = new ethers.Contract(contractAddress, abi, signer)
              const transactionResponse = await contract.mintAllowlist(proof,amount,{value:v})
        } else {
                const amount = document.getElementById("mintAmountAllowlist").value
                const v = amount *9000000000000000
                const provider = new ethers.providers.Web3Provider(window.ethereum)
                const signer = provider.getSigner()
                const claimingddress =  keccak256(await signer.getAddress())
                const proof = await  merkleTreeAllowlist.getHexProof(claimingddress)
                const contract = new ethers.Contract(contractAddress, abi, signer)
                const transactionResponse = await contract.mintAllowlist(proof,amount,{value:v})
                }
        }
    async function mintPublic() {
       if(await window.ethereum.request({ method: 'eth_chainId'}) != '0x1'){
             await window.ethereum.request({
             method: 'wallet_switchEthereumChain',
             params: [{ chainId: targetNetworkId }]})
             const Amount = document.getElementById("mintAmountPublic").value
             const v = Amount*15000000000000000
             const provider = new ethers.providers.Web3Provider(window.ethereum)
             const signer = provider.getSigner()
             const claimingddress =  keccak256(await signer.getAddress())
             const proof = await  merkleTreeAllowlist.getHexProof(claimingddress)
             const contract = new ethers.Contract(contractAddress, abi, signer)
             const transactionResponse = await contract.mintPublic(proof,Amount,{valuse: v})
             }else{
               const Amount = document.getElementById("mintAmountPublic").value
               const v = Amount*15000000000000000
               const provider = new ethers.providers.Web3Provider(window.ethereum)
               const signer = provider.getSigner()
               const claimingddress =  keccak256(await signer.getAddress())
               const proof = await  merkleTreeAllowlist.getHexProof(claimingddress)
               const contract = new ethers.Contract(contractAddress, abi, signer)
               const transactionResponse = await contract.mintPublic(proof,Amount,{valuse: v})
             }
        }
