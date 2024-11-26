let contractAddress = "YOUR_CONTRACT_ADDRESS";
let contractABI = [/* PASTE YOUR ABI HERE */];

let web3, contract, userAccount;

async function connectWallet() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    userAccount = accounts[0];
    contract = new web3.eth.Contract(contractABI, contractAddress);
    document.getElementById("mintNFT").disabled = false;
    alert("Wallet connected: " + userAccount);
  } else {
    alert("Please install Metamask!");
  }
}

async function mintAsset() {
  if (contract && userAccount) {
    try {
      const tx = await contract.methods.createAsset().send({ from: userAccount });
      alert("NFT Minted! Transaction Hash: " + tx.transactionHash);
      displayAssets();
    } catch (error) {
      console.error(error);
    }
  }
}

async function displayAssets() {
  const tokenCounter = await contract.methods.tokenCounter().call();
  const assetList = document.getElementById("assetList");
  assetList.innerHTML = "";

  for (let i = 0; i < tokenCounter; i++) {
    const owner = await contract.methods.ownerOf(i).call();
    if (owner === userAccount) {
      const listItem = document.createElement("li");
      listItem.className = "list-group-item";
      listItem.textContent = `Asset ID: ${i}`;
      assetList.appendChild(listItem);
    }
  }
}

document.getElementById("connectWallet").addEventListener("click", connectWallet);
document.getElementById("mintNFT").addEventListener("click", mintAsset);