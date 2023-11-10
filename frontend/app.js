// frontend/app.js
document.addEventListener("DOMContentLoaded", async () => {
    // Connect to the Ethereum blockchain using ethers.js
    const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545"); // Replace with your RPC endpoint
  
    // Load your smart contract
    const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Replace with your contract address
    const contractAbi = []; // Replace with your contract ABI
    const contract = new ethers.Contract(contractAddress, contractAbi, provider);
  
    // Interact with your contract functions
    const stakeButton = document.getElementById("stakeButton");
    const withdrawButton = document.getElementById("withdrawButton");
    const balanceElement = document.getElementById("balance");
  
    stakeButton.addEventListener("click", async () => {
      const stakeAmount = prompt("Enter the amount to stake:");
      if (stakeAmount !== null) {
        await stake(stakeAmount);
        updateBalance();
      }
    });
  
    withdrawButton.addEventListener("click", async () => {
      await withdraw();
      updateBalance();
    });
  
    // Function to stake tokens
    async function stake(amount) {
      const signer = provider.getSigner();
      const stakingContract = contract.connect(signer);
  
      // Call the stake function on your smart contract
      await stakingContract.stake(amount);
    }
  
    // Function to withdraw tokens
    async function withdraw() {
      const signer = provider.getSigner();
      const stakingContract = contract.connect(signer);
  
      // Call the withdraw function on your smart contract
      await stakingContract.withdraw();
    }
  
    // Function to update the staked balance
    async function updateBalance() {
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();
  
      // Call the getStakedBalance function on your smart contract
      const stakedBalance = await contract.getStakedBalance(userAddress);
  
      // Update the UI with the staked balance
      balanceElement.textContent = `Staked Balance: ${stakedBalance.toString()}`;
    }
  
    // Initial update of the staked balance when the page loads
    await updateBalance();
  });
  