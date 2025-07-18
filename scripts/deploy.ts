import { ethers } from "hardhat";
import { PostManager } from "../typechain-types";
import { run } from "hardhat";

// Sleep utility for retry functionality
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Retry wrapper with exponential backoff
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      const delay = baseDelay * Math.pow(2, i);
      console.log(`Attempt ${i + 1} failed, retrying in ${delay}ms...`);
      console.log(`Error: ${error instanceof Error ? error.message : String(error)}`);
      await sleep(delay);
    }
  }
  throw new Error("Max retries exceeded");
}

async function main() {
  const isDryRun = process.argv.includes('--dry');
  
  console.log(isDryRun ? "Running dry-run deployment..." : "Deploying PostManager contract...");
  
  // Get the contract factory
  const PostManagerFactory = await ethers.getContractFactory("PostManager");
  
  if (isDryRun) {
    // Dry run - estimate gas costs
    console.log("\n=== DRY RUN MODE ===\n");
    
    try {
      // Estimate deployment gas
      const deploymentData = PostManagerFactory.interface.encodeDeploy([]);
      const estimatedGas = await ethers.provider.estimateGas({
        data: deploymentData
      });
      
      const gasPrice = await ethers.provider.getFeeData();
      const networkInfo = await ethers.provider.getNetwork();
      
      console.log("Network:", networkInfo.name, "(Chain ID:", networkInfo.chainId, ")");
      console.log("Estimated gas for deployment:", estimatedGas.toString());
      console.log("Gas price:", gasPrice.gasPrice?.toString(), "wei");
      
      if (gasPrice.gasPrice) {
        const estimatedCost = estimatedGas * gasPrice.gasPrice;
        console.log("Estimated deployment cost:", ethers.formatEther(estimatedCost), "ETH");
      }
      
      console.log("\n=== DRY RUN COMPLETED ===\n");
      return "DRY_RUN_COMPLETED";
    } catch (error) {
      console.error("Dry run failed:", error);
      throw error;
    }
  }
  
  // Actual deployment with retry logic
  const postManager: PostManager = await retryOperation(async () => {
    const contract = await PostManagerFactory.deploy();
    await contract.waitForDeployment();
    return contract;
  });
  
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
  
  // Auto-verify on testnets (not localhost)
  const networkName = deploymentInfo.network.name;
  if (networkName !== "unknown" && networkName !== "localhost" && networkName !== "hardhat") {
    console.log("\n=== STARTING CONTRACT VERIFICATION ===\n");
    
    try {
      await retryOperation(async () => {
        // Wait a bit before verification to ensure contract is propagated
        await sleep(5000);
        
        await run("verify:verify", {
          address: contractAddress,
          constructorArguments: [], // PostManager has no constructor arguments
        });
      });
      
      console.log("✅ Contract verified successfully!");
    } catch (verifyError) {
      console.log("⚠️  Contract verification failed:", verifyError);
      console.log("You can manually verify later with:");
      console.log(`npx hardhat verify --network ${process.env.HARDHAT_NETWORK || 'sepolia'} ${contractAddress}`);
    }
  }
  
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