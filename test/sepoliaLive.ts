import { expect } from "chai";
import { ethers } from "hardhat";
import { PostManager } from "../typechain-types";

describe("SepoliaLive", function () {
  let postManager: PostManager;
  
  // Skip if not on Sepolia network
  before(async function () {
    const network = await ethers.provider.getNetwork();
    if (network.chainId !== 11155111n) {
      this.skip();
    }
    
    // Get PostManager contract address from environment
    const postManagerAddress = process.env.POST_MANAGER_ADDRESS;
    if (!postManagerAddress) {
      throw new Error("POST_MANAGER_ADDRESS environment variable not set");
    }
    
    // Connect to deployed contract
    postManager = await ethers.getContractAt("PostManager", postManagerAddress);
  });

  describe("Sepolia Network Tests", function () {
    it("Should connect to deployed PostManager contract", async function () {
      expect(postManager.target).to.be.properAddress;
      console.log("Connected to PostManager at:", postManager.target);
    });

    it("Should read initial post count", async function () {
      const postCount = await postManager.postCount();
      expect(postCount).to.be.a("bigint");
      console.log("Current post count:", postCount.toString());
    });

    it("Should have correct contract code deployed", async function () {
      const code = await ethers.provider.getCode(postManager.target);
      expect(code).to.not.equal("0x");
      expect(code.length).to.be.greaterThan(2); // More than just "0x"
      console.log("Contract code size:", code.length, "characters");
    });

    it("Should be able to estimate gas for createPost", async function () {
      const testCid = "QmTestCidForGasEstimation12345";
      const signer = (await ethers.getSigners())[0];
      
      try {
        const estimatedGas = await postManager.connect(signer).createPost.estimateGas(testCid);
        expect(estimatedGas).to.be.a("bigint");
        console.log("Estimated gas for createPost:", estimatedGas.toString());
        
        // Check if gas estimation is reasonable (not too high)
        expect(estimatedGas).to.be.lessThan(100000n); // 100k gas should be more than enough
      } catch (error) {
        console.log("Gas estimation failed:", error);
        throw error;
      }
    });

    it("Should create a post successfully on Sepolia", async function () {
      const testCid = `QmSepoliaTest${Date.now()}`;
      const signer = (await ethers.getSigners())[0];
      
      // Get initial post count
      const initialPostCount = await postManager.postCount();
      
      try {
        // Create post transaction
        const tx = await postManager.connect(signer).createPost(testCid);
        const receipt = await tx.wait();
        
        expect(receipt).to.not.be.null;
        expect(receipt?.status).to.equal(1); // Success
        
        // Check post count incremented
        const newPostCount = await postManager.postCount();
        expect(newPostCount).to.equal(initialPostCount + 1n);
        
        // Verify post data
        const postId = newPostCount;
        const storedCid = await postManager.getPost(postId);
        const storedAuthor = await postManager.getAuthor(postId);
        
        expect(storedCid).to.equal(testCid);
        expect(storedAuthor).to.equal(signer.address);
        
        console.log("✅ Post created successfully on Sepolia!");
        console.log("- Transaction hash:", receipt?.hash);
        console.log("- Post ID:", postId.toString());
        console.log("- CID:", storedCid);
        console.log("- Author:", storedAuthor);
        console.log("- Gas used:", receipt?.gasUsed?.toString());
      } catch (error) {
        console.log("❌ Post creation failed:", error);
        throw error;
      }
    });

    it("Should verify PostCreated event was emitted", async function () {
      const testCid = `QmSepoliaEventTest${Date.now()}`;
      const signer = (await ethers.getSigners())[0];
      
      // Listen for event
      const tx = await postManager.connect(signer).createPost(testCid);
      const receipt = await tx.wait();
      
      // Check event was emitted
      const events = receipt?.logs || [];
      const postCreatedEvent = events.find(log => {
        try {
          const parsed = postManager.interface.parseLog(log);
          return parsed?.name === "PostCreated";
        } catch {
          return false;
        }
      });
      
      expect(postCreatedEvent).to.not.be.undefined;
      
      if (postCreatedEvent) {
        const parsed = postManager.interface.parseLog(postCreatedEvent);
        expect(parsed?.args[1]).to.equal(signer.address); // author
        expect(parsed?.args[2]).to.equal(testCid); // cid
        console.log("✅ PostCreated event verified on Sepolia!");
      }
    });

    it("Should check network gas price and block info", async function () {
      const feeData = await ethers.provider.getFeeData();
      const blockNumber = await ethers.provider.getBlockNumber();
      const block = await ethers.provider.getBlock(blockNumber);
      
      console.log("Network info:");
      console.log("- Current block:", blockNumber);
      console.log("- Block timestamp:", block?.timestamp);
      console.log("- Gas price:", feeData.gasPrice?.toString(), "wei");
      console.log("- Max fee per gas:", feeData.maxFeePerGas?.toString(), "wei");
      console.log("- Max priority fee:", feeData.maxPriorityFeePerGas?.toString(), "wei");
      
      expect(blockNumber).to.be.greaterThan(0);
      expect(feeData.gasPrice).to.be.greaterThan(0n);
    });
  });
});