import { expect } from "chai";
import { ethers } from "hardhat";
import { PostManager } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("PostManager", function () {
  let postManager: PostManager;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  beforeEach(async function () {
    // Get signers
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy PostManager contract
    const PostManagerFactory = await ethers.getContractFactory("PostManager");
    postManager = await PostManagerFactory.deploy();
    await postManager.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the initial post count to 0", async function () {
      expect(await postManager.postCount()).to.equal(0);
    });
  });

  describe("Creating Posts", function () {
    it("Should create a post and increment postCount", async function () {
      const cid = "QmTzQ1M2R3K4L5N6O7P8Q9R0S1T2U3V4W5X6Y7Z8A9B0C1D2E3F4";
      
      // Create post
      await postManager.connect(user1).createPost(cid);
      
      // Check post count incremented
      expect(await postManager.postCount()).to.equal(1);
      
      // Check post data stored correctly
      expect(await postManager.posts(1)).to.equal(cid);
      expect(await postManager.authors(1)).to.equal(user1.address);
    });

    it("Should emit PostCreated event with correct parameters", async function () {
      const cid = "QmTzQ1M2R3K4L5N6O7P8Q9R0S1T2U3V4W5X6Y7Z8A9B0C1D2E3F4";
      
      // Expect event emission
      await expect(postManager.connect(user1).createPost(cid))
        .to.emit(postManager, "PostCreated")
        .withArgs(1, user1.address, cid);
    });

    it("Should allow multiple posts from same author", async function () {
      const cid1 = "QmTzQ1M2R3K4L5N6O7P8Q9R0S1T2U3V4W5X6Y7Z8A9B0C1D2E3F4";
      const cid2 = "QmAbC1D2E3F4G5H6I7J8K9L0M1N2O3P4Q5R6S7T8U9V0W1X2Y3Z4";
      
      // Create first post
      await postManager.connect(user1).createPost(cid1);
      
      // Create second post
      await postManager.connect(user1).createPost(cid2);
      
      // Check both posts exist
      expect(await postManager.postCount()).to.equal(2);
      expect(await postManager.posts(1)).to.equal(cid1);
      expect(await postManager.posts(2)).to.equal(cid2);
      expect(await postManager.authors(1)).to.equal(user1.address);
      expect(await postManager.authors(2)).to.equal(user1.address);
    });

    it("Should allow posts from different authors", async function () {
      const cid1 = "QmTzQ1M2R3K4L5N6O7P8Q9R0S1T2U3V4W5X6Y7Z8A9B0C1D2E3F4";
      const cid2 = "QmAbC1D2E3F4G5H6I7J8K9L0M1N2O3P4Q5R6S7T8U9V0W1X2Y3Z4";
      
      // Create post from user1
      await postManager.connect(user1).createPost(cid1);
      
      // Create post from user2
      await postManager.connect(user2).createPost(cid2);
      
      // Check posts stored correctly
      expect(await postManager.postCount()).to.equal(2);
      expect(await postManager.authors(1)).to.equal(user1.address);
      expect(await postManager.authors(2)).to.equal(user2.address);
    });

    it("Should return correct post ID when creating post", async function () {
      const cid = "QmTzQ1M2R3K4L5N6O7P8Q9R0S1T2U3V4W5X6Y7Z8A9B0C1D2E3F4";
      
      // Create post and get transaction
      const tx = await postManager.connect(user1).createPost(cid);
      const receipt = await tx.wait();
      
      // Check event contains correct post ID
      const event = receipt?.logs[0];
      expect(event).to.exist;
      
      // Parse event to check post ID
      const parsedEvent = postManager.interface.parseLog(event!);
      expect(parsedEvent?.args[0]).to.equal(1n); // Post ID should be 1
    });
  });

  describe("Getter Functions", function () {
    beforeEach(async function () {
      // Create a test post
      const cid = "QmTzQ1M2R3K4L5N6O7P8Q9R0S1T2U3V4W5X6Y7Z8A9B0C1D2E3F4";
      await postManager.connect(user1).createPost(cid);
    });

    it("Should return correct post CID", async function () {
      const cid = "QmTzQ1M2R3K4L5N6O7P8Q9R0S1T2U3V4W5X6Y7Z8A9B0C1D2E3F4";
      expect(await postManager.getPost(1)).to.equal(cid);
    });

    it("Should return correct author address", async function () {
      expect(await postManager.getAuthor(1)).to.equal(user1.address);
    });

    it("Should return correct post data", async function () {
      const cid = "QmTzQ1M2R3K4L5N6O7P8Q9R0S1T2U3V4W5X6Y7Z8A9B0C1D2E3F4";
      const [returnedCid, returnedAuthor] = await postManager.getPostData(1);
      
      expect(returnedCid).to.equal(cid);
      expect(returnedAuthor).to.equal(user1.address);
    });

    it("Should return empty string for non-existent post", async function () {
      expect(await postManager.getPost(999)).to.equal("");
    });

    it("Should return zero address for non-existent post author", async function () {
      expect(await postManager.getAuthor(999)).to.equal(ethers.ZeroAddress);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle empty CID string", async function () {
      const emptyCid = "";
      
      await expect(postManager.connect(user1).createPost(emptyCid))
        .to.emit(postManager, "PostCreated")
        .withArgs(1, user1.address, emptyCid);
      
      expect(await postManager.posts(1)).to.equal(emptyCid);
    });

    it("Should handle very long CID string", async function () {
      const longCid = "Qm" + "a".repeat(1000); // Very long CID
      
      await expect(postManager.connect(user1).createPost(longCid))
        .to.emit(postManager, "PostCreated")
        .withArgs(1, user1.address, longCid);
      
      expect(await postManager.posts(1)).to.equal(longCid);
    });

    it("Should handle sequential post creation correctly", async function () {
      const cids = [
        "QmTzQ1M2R3K4L5N6O7P8Q9R0S1T2U3V4W5X6Y7Z8A9B0C1D2E3F4",
        "QmAbC1D2E3F4G5H6I7J8K9L0M1N2O3P4Q5R6S7T8U9V0W1X2Y3Z4",
        "QmXyZ9A8B7C6D5E4F3G2H1I0J9K8L7M6N5O4P3Q2R1S0T9U8V7W6"
      ];
      
      // Create posts sequentially
      for (let i = 0; i < cids.length; i++) {
        await expect(postManager.connect(user1).createPost(cids[i]))
          .to.emit(postManager, "PostCreated")
          .withArgs(i + 1, user1.address, cids[i]);
      }
      
      // Check all posts exist
      expect(await postManager.postCount()).to.equal(cids.length);
      
      // Verify all posts are stored correctly
      for (let i = 0; i < cids.length; i++) {
        expect(await postManager.posts(i + 1)).to.equal(cids[i]);
        expect(await postManager.authors(i + 1)).to.equal(user1.address);
      }
    });
  });
});