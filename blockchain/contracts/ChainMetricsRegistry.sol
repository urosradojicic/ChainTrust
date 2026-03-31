// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ChainMetricsRegistry is Ownable {
    struct Startup {
        address owner;
        string name;
        string category;
        string metadataURI;
        uint256 registeredAt;
        bool isVerified;
        uint256 verifiedAt;
        uint256 trustScore;
        uint256 totalReports;
    }

    struct Metrics {
        uint256 timestamp;
        uint256 mrr;
        uint256 totalUsers;
        uint256 activeUsers;
        uint256 burnRate;
        uint256 runway;
        int256 growthRate;
        uint256 carbonOffset;
        bytes32 proofHash;
        bool oracleVerified;
    }

    uint256 public startupCount;
    mapping(uint256 => Startup) public startups;
    mapping(uint256 => Metrics) public latestMetrics;
    uint256[] private _allIds;

    event StartupRegistered(uint256 indexed id, address indexed owner, string name);
    event MetricsPublished(uint256 indexed id, bytes32 proofHash, uint256 timestamp);

    constructor() Ownable(msg.sender) {}

    function registerStartup(string calldata name, string calldata category, string calldata metadataURI) external {
        startupCount++;
        uint256 id = startupCount;
        startups[id] = Startup({
            owner: msg.sender,
            name: name,
            category: category,
            metadataURI: metadataURI,
            registeredAt: block.timestamp,
            isVerified: false,
            verifiedAt: 0,
            trustScore: 50,
            totalReports: 0
        });
        _allIds.push(id);
        emit StartupRegistered(id, msg.sender, name);
    }

    function publishMetrics(
        uint256 startupId,
        uint256 mrr,
        uint256 totalUsers,
        uint256 activeUsers,
        uint256 burnRate,
        uint256 runway,
        int256 growthRate,
        uint256 carbonOffset,
        bytes32 proofHash
    ) external {
        require(startups[startupId].owner == msg.sender, "Not startup owner");
        latestMetrics[startupId] = Metrics({
            timestamp: block.timestamp,
            mrr: mrr,
            totalUsers: totalUsers,
            activeUsers: activeUsers,
            burnRate: burnRate,
            runway: runway,
            growthRate: growthRate,
            carbonOffset: carbonOffset,
            proofHash: proofHash,
            oracleVerified: false
        });
        startups[startupId].totalReports++;
        emit MetricsPublished(startupId, proofHash, block.timestamp);
    }

    function getStartup(uint256 startupId) external view returns (Startup memory) {
        return startups[startupId];
    }

    function getLatestMetrics(uint256 startupId) external view returns (Metrics memory) {
        return latestMetrics[startupId];
    }

    function getAllStartupIds() external view returns (uint256[] memory) {
        return _allIds;
    }

    function getStartupCount() external view returns (uint256) {
        return startupCount;
    }

    function verifyStartup(uint256 startupId) external onlyOwner {
        startups[startupId].isVerified = true;
        startups[startupId].verifiedAt = block.timestamp;
    }
}
