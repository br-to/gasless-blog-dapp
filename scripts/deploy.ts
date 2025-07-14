import { ethers } from "hardhat";
import { PostManager } from "../typechain-types";

async function main() {
  console.log("Deploying PostManager contract...");
  
  // Get the contract factory
  const PostManagerFactory = await ethers.getContractFactory("PostManager");
  
  // Deploy the contract
  const postManager: PostManager = await PostManagerFactory.deploy();
  await postManager.waitForDeployment();
  
  const contractAddress = await postManager.getAddress();
  console.log("PostManager deployed to:", contractAddress);
  
  // Get deployment information
  const deploymentInfo = {
    contractAddress,
    network: await ethers.provider.getNetwork(),
    deployer: (await ethers.getSigners())[0].address,
    blockNumber: await ethers.provider.getBlockNumber(),
    timestamp: new Date().toISOString()
  };
  
  console.log("Deployment Info:", deploymentInfo);
  
  // Verify initial state
  console.log("Initial post count:", await postManager.postCount());
  
  return contractAddress;
}

// Execute deployment
main()
  .then((contractAddress) => {
    console.log("Deployment successful!");
    console.log("Contract address:", contractAddress);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });