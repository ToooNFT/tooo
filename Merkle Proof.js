const {
  MerkleTree,
} = require("/home/tamaztamaz/NFTNFT/node_modules/merkletreejs/dist/index.js");
const keccak256 = require("/home/tamaztamaz/NFTNFT/node_modules/keccak256/dist/keccak256.js");

const whitelistAddress = [
  "0xbC8AeB34F67062e5DDf90C6c1332c2c0285b9fF9",
  "0x8fefAD1e0AF33F53704346764Eab1d63557F75D0",
  "0x567e04aC9bDA6c0B7CB247B6b4e1dDb10BC2ba39",
  "0x74D99d3c146E5F412F955462C8cbefC623DCD12c",
  "0x1cE41a3Cbd66b40C2A7935Cb91960795fd0b3692",
  "0x6Efd92a21517Badd12089CDcD5C04c71dC2C67e2",
  "0xBcae3390E6F459fb2Cd5CA1E286a69679d7294fD",
];

const leafNodes = whitelistAddress.map((addr) => keccak256(addr));
export const merkleTree = new MerkleTree(leafNodes, keccak256, {
  sortPairs: true,
});
const roothash = merkleTree.getRoot();
console.log(merkleTree);

const claimingddress = keccak256("0x74D99d3c146E5F412F955462C8cbefC623DCD12c");
console.log(merkleTree.getHexProof(claimingddress));

var str = merkleTree.getHexProof(claimingddress);
