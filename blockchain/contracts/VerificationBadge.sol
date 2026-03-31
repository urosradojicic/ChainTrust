// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VerificationBadge is ERC721, Ownable {
    struct Badge {
        uint256 startupId;
        uint256 trustScore;
        uint256 verifiedAt;
        address verifier;
    }

    uint256 private _nextTokenId;
    mapping(uint256 => Badge) public badges;
    mapping(uint256 => uint256) public startupToBadge;

    event BadgeMinted(uint256 indexed tokenId, uint256 indexed startupId, uint256 trustScore);

    constructor() ERC721("ChainMetrics Verification Badge", "CMVB") Ownable(msg.sender) {}

    function mintBadge(address to, uint256 startupId, uint256 trustScore) external onlyOwner {
        _nextTokenId++;
        uint256 tokenId = _nextTokenId;
        _mint(to, tokenId);
        badges[tokenId] = Badge({
            startupId: startupId,
            trustScore: trustScore,
            verifiedAt: block.timestamp,
            verifier: msg.sender
        });
        startupToBadge[startupId] = tokenId;
        emit BadgeMinted(tokenId, startupId, trustScore);
    }

    /// @notice Soulbound: tokens cannot be transferred
    function locked(uint256 tokenId) external view returns (bool) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return true; // Always locked (soulbound)
    }

    /// @notice Override transfer to make soulbound
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert("Soulbound: transfer not allowed");
        }
        return super._update(to, tokenId, auth);
    }
}
