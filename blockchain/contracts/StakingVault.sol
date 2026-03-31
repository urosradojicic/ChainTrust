// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StakingVault is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public cmtToken;

    enum Tier { Basic, Pro, Whale }

    struct Investor {
        uint256 stakedAmount;
        uint256 stakedAt;
        uint256 lockUntil;
        Tier tier;
        uint256 pendingRewards;
    }

    mapping(address => Investor) public investors;
    mapping(address => uint256) private _shares;
    uint256 public totalStakedAmount;
    uint256 public totalInvestors;

    uint256 public constant PRO_THRESHOLD = 5_000 * 1e18;
    uint256 public constant WHALE_THRESHOLD = 50_000 * 1e18;
    uint256 public constant LOCK_PERIOD = 30 days;

    event Staked(address indexed investor, uint256 amount, Tier tier);
    event Unstaked(address indexed investor, uint256 amount);
    event RewardsClaimed(address indexed investor, uint256 amount);

    constructor(address _cmtToken) Ownable(msg.sender) {
        cmtToken = IERC20(_cmtToken);
    }

    function stake(uint256 amount) external {
        require(amount > 0, "Cannot stake 0");
        cmtToken.safeTransferFrom(msg.sender, address(this), amount);

        if (investors[msg.sender].stakedAmount == 0) {
            totalInvestors++;
        }

        investors[msg.sender].stakedAmount += amount;
        investors[msg.sender].stakedAt = block.timestamp;
        investors[msg.sender].lockUntil = block.timestamp + LOCK_PERIOD;
        investors[msg.sender].tier = _computeTier(investors[msg.sender].stakedAmount);
        _shares[msg.sender] += amount;
        totalStakedAmount += amount;

        emit Staked(msg.sender, amount, investors[msg.sender].tier);
    }

    function unstake(uint256 shares) external {
        require(_shares[msg.sender] >= shares, "Insufficient shares");
        require(block.timestamp >= investors[msg.sender].lockUntil, "Still locked");

        _shares[msg.sender] -= shares;
        investors[msg.sender].stakedAmount -= shares;
        totalStakedAmount -= shares;

        if (investors[msg.sender].stakedAmount == 0) {
            totalInvestors--;
        }
        investors[msg.sender].tier = _computeTier(investors[msg.sender].stakedAmount);

        cmtToken.safeTransfer(msg.sender, shares);
        emit Unstaked(msg.sender, shares);
    }

    function claimRewards() external {
        uint256 rewards = investors[msg.sender].pendingRewards;
        require(rewards > 0, "No rewards");
        investors[msg.sender].pendingRewards = 0;
        cmtToken.safeTransfer(msg.sender, rewards);
        emit RewardsClaimed(msg.sender, rewards);
    }

    function getInvestorTier(address investor) external view returns (Tier) {
        return investors[investor].tier;
    }

    function canAccessPremium(address investor) external view returns (bool) {
        return investors[investor].tier >= Tier.Pro;
    }

    function balanceOf(address account) external view returns (uint256) {
        return _shares[account];
    }

    function _computeTier(uint256 amount) internal pure returns (Tier) {
        if (amount >= WHALE_THRESHOLD) return Tier.Whale;
        if (amount >= PRO_THRESHOLD) return Tier.Pro;
        return Tier.Basic;
    }
}
