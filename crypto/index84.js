import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress, whitelistAddress,allowlistAddress} from "./constants2.js"


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
mintAllowlistButton.onclick = mintAllowlist
mintPublicButton.onclick = mintPublic

const targetChain = "0x89"
//Connect metamask
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
//mint Functions
  async function mintWl() {
    if(await window.ethereum.request({ method: 'eth_chainId'}) != targetChain){
        await window.ethereum.request({method: 'wallet_switchEthereumChain', params: [{ chainId: targetChain }] })}

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    if(await contract.checkWlMint() == true ){
    const claimingddress =  keccak256(await signer.getAddress())
        if(await merkleTreeWl.getHexProof(claimingddress)>0){
            const proof = await  merkleTreeWl.getHexProof(claimingddress)
            const transactionResponse = await contract.mintWl(proof)}
    else{
        mintWlButton.innerHTML = "You are not eligble"
    }     
    }else{
        mintWlButton.innerHTML = "WL Mint is close"
    }
   }
     
    async function mintAllowlist() {
        const Amount = document.getElementById("mintAmountAllowlist").value
        if(Amount==1){
            let values =  ethers.utils.parseUnits("0.009").toString()}
        else{
             let values = ethers.utils.parseUnits("0.018").toString()}
        if(await window.ethereum.request({ method: 'eth_chainId'}) != targetChain){
            await window.ethereum.request({method: 'wallet_switchEthereumChain', params: [{ chainId: targetChain }] })}
    
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        if(await contract.checkWlMint() == true ){
        const claimingddress =  keccak256(await signer.getAddress())
            if(await merkleTreeAllowlist.getHexProof(claimingddress)>0){
                const proof = await  merkleTreeAllowlist.getHexProof(claimingddress)
                const transactionResponse = await contract.mintAllowlist(proof,Amount,{value:values })}
        else{
            mintWlButton.innerHTML = "You are not eligble"
        }     
        }else{
            mintWlButton.innerHTML = "WL Mint is close"
        }
        }

    async function mintPublic() {
        const Amount = document.getElementById("mintAmountPublic").value
        if(Amount == 1){
            let values =  ethers.utils.parseUnits("0.015").toString()
        }else{
            let values = ethers.utils.parseUnits("0.030").toString()}   
        if(await window.ethereum.request({ method: 'eth_chainId'}) != targetChain){
            await window.ethereum.request({method: 'wallet_switchEthereumChain', params: [{ chainId: targetChain }] })}
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        if(await contract.checkPublicMint() == true ){
        const transactionResponse = await contract.mintPublic(Amount,{value: values})}
        else{
            mintPublicButton.innerHTML= "Public Mint is close"}
        }
