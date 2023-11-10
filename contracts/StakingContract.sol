// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StakingContract {
    address public owner;
    uint256 public stakingPeriod;
    uint256 public rewardRate;
    uint256 public totalStaked;
    uint256 public totalRewards;

    mapping(address => uint256) public userBalances;
    mapping(address => uint256) public userRewards;
    mapping(address => uint256) public userStakedTimestamp;
    mapping(address => bool) public stakingStatus;
    address[] public stakers;

    
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 amount);
    event RewardDistributed(address indexed user, uint256 amount);


    constructor(uint256 _stakingPeriod, uint256 _rewardRate) {
        owner = msg.sender;
        stakingPeriod = _stakingPeriod;
        rewardRate = _rewardRate;
    }


    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    // Function to stake tokens
    function calculateRewards(address user) external view returns (uint256) {
        require(userBalances[user] > 0, "User has no staked amount");

        uint256 stakedAmount = userBalances[user];
        uint256 stakingTime = block.timestamp - userStakedTimestamp[user];

        return (stakedAmount * stakingTime) / stakingPeriod;
    }


    function stake(uint256 _amount) external {
        require(_amount > 0, "Staked amount must be greater than 0");
        require(!stakingStatus[msg.sender], "User can only stake once");

        // ...

        stakingStatus[msg.sender] = true;
        stakers.push(msg.sender);

        emit Staked(msg.sender, _amount);
    }
    function distributeRewards() external onlyOwner {
        require(block.timestamp >= stakingPeriod, "Staking period has not ended yet");

        for (uint256 i = 0; i < stakers.length; i++) {
            address staker = stakers[i];
            uint256 stakedAmount = userBalances[staker];
            uint256 stakingTime = block.timestamp - userStakedTimestamp[staker];
            uint256 reward = (stakedAmount * stakingTime) / stakingPeriod;

            // Add rewards to staker's balance
            userRewards[staker] += reward;
            totalRewards += reward;

            emit RewardDistributed(staker, reward);
        }

        // Reset staking period and clear stakers list
        stakingPeriod = block.timestamp;
        delete stakers;
    }
    

    function withdraw() external {
        require(userBalances[msg.sender] > 0, "No staked amount to withdraw");

        uint256 stakedAmount = userBalances[msg.sender];
        uint256 stakingTime = block.timestamp - userStakedTimestamp[msg.sender];
        uint256 reward = (stakedAmount * rewardRate * stakingTime) / stakingPeriod;

        userBalances[msg.sender] = 0;
        userRewards[msg.sender] += reward;
        totalRewards += reward;
        totalStaked -= stakedAmount;

        emit Withdrawn(msg.sender, stakedAmount);
        emit RewardClaimed(msg.sender, reward);
    }
    
    function getStakedBalance(address user) external view returns (uint256) {
        return userBalances[user];
    }

    function getRewardsBalance(address user) external view returns (uint256) {
        return userRewards[user];
    }

    function claimRewards() external {
        require(userRewards[msg.sender] > 0, "No rewards to claim");




        totalRewards -= userRewards[msg.sender];
        userRewards[msg.sender] = 0;

        emit RewardClaimed(msg.sender, userRewards[msg.sender]);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner address");
        owner = newOwner;
    }
    
}