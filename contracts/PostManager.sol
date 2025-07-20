// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title PostManager
 * @dev Contract for managing blog posts on-chain
 * @notice This contract stores IPFS/Bundlr CIDs and author addresses for blog posts
 */
contract PostManager {
    /// @notice Auto-increment primary key for posts
    uint256 public postCount;

    /// @notice Mapping from post ID to IPFS/Bundlr CID
    mapping(uint256 => string) public posts;

    /// @notice Mapping from post ID to author address
    mapping(uint256 => address) public authors;

    /// @notice Event emitted when a new post is created
    event PostCreated(uint256 indexed id, address indexed author, string cid);

    /**
     * @dev Creates a new post with the given CID
     * @param cid The IPFS/Bundlr CID of the post content
     * @return postId The ID of the created post
     */
    function createPost(string calldata cid) external returns (uint256 postId) {
        // Increment post count to get new post ID
        postCount++;
        postId = postCount;

        // Store the post data
        posts[postId] = cid;
        authors[postId] = msg.sender;

        // Emit event
        emit PostCreated(postId, msg.sender, cid);
    }

    /**
     * @dev Returns the post CID for a given post ID
     * @param postId The post ID to query
     * @return cid The IPFS/Bundlr CID of the post
     */
    function getPost(uint256 postId) external view returns (string memory cid) {
        return posts[postId];
    }

    /**
     * @dev Returns the author address for a given post ID
     * @param postId The post ID to query
     * @return author The address of the post author
     */
    function getAuthor(uint256 postId) external view returns (address author) {
        return authors[postId];
    }

    /**
     * @dev Returns the post data for a given post ID
     * @param postId The post ID to query
     * @return cid The IPFS/Bundlr CID of the post
     * @return author The address of the post author
     */
    function getPostData(uint256 postId) external view returns (string memory cid, address author) {
        return (posts[postId], authors[postId]);
    }

    /**
     * @dev Returns the total number of posts created
     * @return count The total number of posts
     */
    function getTotalPosts() external view returns (uint256 count) {
        return postCount;
    }
}
