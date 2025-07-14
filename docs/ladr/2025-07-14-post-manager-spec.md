# 2025-07-14: PostManager Smart Contract Specification

## Status
Accepted

## Context
The gasless blog DApp requires a smart contract to manage blog posts on-chain. The contract serves as the foundational component for the gasless posting functionality, providing immutable storage of post metadata and author verification.

## Requirements
- Store blog post metadata (IPFS/Bundlr CID) with author attribution
- Provide auto-incrementing post IDs for easy enumeration
- Emit events for frontend integration and indexing
- Minimal gas usage for efficient operation
- No upgradeability, edit/delete, or access control features in v0

## Decision
Implement a `PostManager` contract with the following specification:

### Storage Structure
- `postCount`: Auto-incrementing counter for post IDs (starts at 0)
- `posts`: Mapping from post ID to IPFS/Bundlr CID
- `authors`: Mapping from post ID to author address

### Public API
- `createPost(string calldata cid) external returns (uint256 postId)`
  - Increments postCount
  - Stores CID and author address
  - Emits PostCreated event
  - Returns the new post ID

- `getPost(uint256 postId) external view returns (string memory cid)`
- `getAuthor(uint256 postId) external view returns (address author)`
- `getPostData(uint256 postId) external view returns (string memory cid, address author)`

### Events
- `PostCreated(uint256 indexed id, address indexed author, string cid)`

### Technical Details
- Solidity version: ^0.8.24 (using 0.8.28 for latest features)
- Gas optimization: Compiler optimizer enabled with 200 runs
- No OpenZeppelin dependencies required (simple contract)
- Comprehensive test coverage with edge cases

## Implementation
The contract has been implemented with the following characteristics:

1. **Minimal State**: Only essential storage for post metadata
2. **Gas Efficient**: Uses calldata for string parameters and minimal storage operations
3. **Event-Driven**: Emits indexed events for efficient filtering
4. **Immutable Posts**: Once created, posts cannot be modified (future feature)
5. **Robust Testing**: 14 test cases covering all functionality and edge cases

## Testing Results
✅ All 14 tests passing
✅ Contract size: 1.250 KiB (within gas limits)
✅ Compilation successful on Solidity 0.8.28
✅ Deployment script functional

## Consequences
### Benefits
- Simple and secure contract design
- Low gas costs for post creation
- Easy integration with frontend applications
- Immutable post metadata storage
- Event-based architecture for indexing

### Limitations
- No post editing or deletion capability
- No access control or moderation features
- No on-chain content storage (relies on IPFS/Bundlr)
- No upgradeability pattern

### Future Considerations
- Integration with Account Abstraction for gasless transactions
- Potential extension for post editing/deletion
- Integration with decentralized storage solutions
- Addition of post categorization or tagging

## Related
- Issue #3: PostManager Smart Contract Implementation
- Future: Account Abstraction SDK integration
- Future: Frontend integration with Wagmi/Viem