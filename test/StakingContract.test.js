// test/StakingContract.test.js
// test/StakingContract.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("StakingContract", function () {
  let StakingContract;
  let stakingContract;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy the StakingContract
    StakingContract = await ethers.getContractFactory("StakingContract");
    stakingContract = await StakingContract.deploy(86400, 100); // 86400 seconds (1 day) staking period, 100 reward rate
    await stakingContract.deployed();
  });

  it("should allow users to stake tokens", async function () {
    const initialBalance = await stakingContract.getStakedBalance(user1.address);

    // User1 stakes 10 tokens
    await stakingContract.connect(user1).stake(10);

    const finalBalance = await stakingContract.getStakedBalance(user1.address);

    expect(finalBalance).to.equal(initialBalance.add(10));
  });

  it("should distribute rewards to stakers", async function () {
    // User1 stakes 10 tokens
    await stakingContract.connect(user1).stake(10);

    // Fast forward time to the end of the staking period
    await network.provider.send("evm_increaseTime", [86400]); // 86400 seconds (1 day)

    const initialRewardsBalance = await stakingContract.getRewardsBalance(user1.address);

    // Owner distributes rewards
    await stakingContract.connect(owner).distributeRewards();

    const finalRewardsBalance = await stakingContract.getRewardsBalance(user1.address);

    expect(finalRewardsBalance).to.be.gt(initialRewardsBalance);
  });

  it("should allow users to withdraw staked tokens and rewards", async function () {
    // User1 stakes 10 tokens
    await stakingContract.connect(user1).stake(10);

    // Fast forward time to the end of the staking period
    await network.provider.send("evm_increaseTime", [86400]); // 86400 seconds (1 day)

    // Owner distributes rewards
    await stakingContract.connect(owner).distributeRewards();

    const initialBalance = await stakingContract.getStakedBalance(user1.address);
    const initialRewardsBalance = await stakingContract.getRewardsBalance(user1.address);

    // User1 withdraws
    await stakingContract.connect(user1).withdraw();

    const finalBalance = await stakingContract.getStakedBalance(user1.address);
    const finalRewardsBalance = await stakingContract.getRewardsBalance(user1.address);

    expect(finalBalance).to.equal(0);
    expect(finalRewardsBalance).to.be.gt(initialRewardsBalance);
  });
});