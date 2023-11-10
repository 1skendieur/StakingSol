// scripts/deploy.js
async function main() {
    const StakingContract = await ethers.getContractFactory("StakingContract");
    const stakingContract = await StakingContract.deploy(86400, 100); // Adjust parameters as needed
    await stakingContract.deployed();
  
    console.log("StakingContract deployed to:", stakingContract.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });