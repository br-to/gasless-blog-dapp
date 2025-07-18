import { ethers } from "hardhat";
import { run } from "hardhat";
import { PostManager } from "../typechain-types";
import * as https from "https";
import * as http from "http";

interface DeploymentResult {
  contractAddress: string;
  network: any;
  deployer: string;
  blockNumber: number;
  timestamp: string;
  gasUsed?: bigint;
  deploymentCost?: string;
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      console.log(`Attempt ${i + 1} failed:`, error.message);
      
      if (i < maxRetries - 1) {
        const backoffDelay = delay * Math.pow(2, i);
        console.log(`Retrying in ${backoffDelay}ms...`);
        await sleep(backoffDelay);
      }
    }
  }
  
  throw lastError!;
}

async function estimateGas(): Promise<void> {
  console.log("📊 Estimating gas costs...");
  
  const PostManagerFactory = await ethers.getContractFactory("PostManager");
  const deploymentData = PostManagerFactory.getDeployTransaction();
  
  try {
    const gasEstimate = await ethers.provider.estimateGas(deploymentData);
    const gasPrice = await ethers.provider.getGasPrice();
    const deploymentCost = gasEstimate * gasPrice;
    
    console.log("⛽ Gas Estimation:");
    console.log(`  - Estimated gas: ${gasEstimate.toString()}`);
    console.log(`  - Gas price: ${ethers.formatUnits(gasPrice, "gwei")} gwei`);
    console.log(`  - Estimated cost: ${ethers.formatEther(deploymentCost)} ETH`);
    
    return;
  } catch (error) {
    console.warn("⚠️  Gas estimation failed:", error.message);
  }
}

async function sendWebhookNotification(status: 'success' | 'failure', deploymentResult?: DeploymentResult, error?: Error): Promise<void> {
  const webhookUrl = process.env.WEBHOOK_URL;
  const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
  
  if (!webhookUrl && !discordWebhookUrl) {
    console.log("🔕 No webhook URLs configured, skipping notification");
    return;
  }
  
  const network = deploymentResult?.network || await ethers.provider.getNetwork();
  const timestamp = new Date().toISOString();
  
  const payload = {
    success: status === 'success',
    timestamp,
    network: `${network.name} (${network.chainId})`,
    ...(deploymentResult && {
      contractAddress: deploymentResult.contractAddress,
      deployer: deploymentResult.deployer,
      gasUsed: deploymentResult.gasUsed?.toString(),
      deploymentCost: deploymentResult.deploymentCost
    }),
    ...(error && {
      error: error.message,
      stack: error.stack
    })
  };
  
  const discordPayload = {
    embeds: [{
      title: status === 'success' ? "✅ デプロイ成功" : "❌ デプロイ失敗",
      description: status === 'success' ? "Sepoliaへのデプロイが完了しました" : "Sepoliaへのデプロイが失敗しました",
      color: status === 'success' ? 0x00ff00 : 0xff0000,
      fields: [
        { name: "ネットワーク", value: `${network.name} (${network.chainId})`, inline: true },
        { name: "タイムスタンプ", value: timestamp, inline: true },
        ...(deploymentResult ? [
          { name: "コントラクトアドレス", value: deploymentResult.contractAddress, inline: false },
          { name: "デプロイヤー", value: deploymentResult.deployer, inline: true },
          { name: "ガス使用量", value: deploymentResult.gasUsed?.toString() || "N/A", inline: true },
          { name: "デプロイコスト", value: `${deploymentResult.deploymentCost} ETH`, inline: true }
        ] : []),
        ...(error ? [
          { name: "エラー", value: error.message, inline: false }
        ] : [])
      ]
    }]
  };
  
  const sendWebhook = async (url: string, data: any): Promise<void> => {
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify(data);
      const urlObj = new URL(url);
      const client = urlObj.protocol === 'https:' ? https : http;
      
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };
      
      const req = client.request(options, (res) => {
        res.on('data', () => {});
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve();
          } else {
            reject(new Error(`HTTP ${res.statusCode}`));
          }
        });
      });
      
      req.on('error', reject);
      req.write(postData);
      req.end();
    });
  };
  
  const notifications = [];
  
  if (webhookUrl) {
    notifications.push(
      sendWebhook(webhookUrl, payload).catch(err => 
        console.warn("⚠️  Slack webhook failed:", err.message)
      )
    );
  }
  
  if (discordWebhookUrl) {
    notifications.push(
      sendWebhook(discordWebhookUrl, discordPayload).catch(err => 
        console.warn("⚠️  Discord webhook failed:", err.message)
      )
    );
  }
  
  try {
    await Promise.all(notifications);
    console.log("📢 Webhook notifications sent successfully");
  } catch (error) {
    console.warn("⚠️  Some webhook notifications failed");
  }
}

async function verifyContract(contractAddress: string): Promise<void> {
  const network = await ethers.provider.getNetwork();
  const isTestnet = network.chainId === 11155111n || network.chainId === 80002n || network.chainId === 43113n;
  
  if (!isTestnet) {
    console.log("⚠️  Verification skipped for non-testnet network");
    return;
  }
  
  console.log("🔍 Verifying contract on block explorer...");
  
  try {
    await retry(async () => {
      await run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
    }, 3, 5000);
    
    console.log("✅ Contract verified successfully!");
  } catch (error) {
    console.warn("⚠️  Verification failed:", error.message);
    console.log("📝 Manual verification may be required");
  }
}

async function deployContract(): Promise<DeploymentResult> {
  console.log("🚀 Deploying PostManager contract...");
  
  const PostManagerFactory = await ethers.getContractFactory("PostManager");
  const [deployer] = await ethers.getSigners();
  
  console.log("👤 Deployer:", deployer.address);
  
  const postManager: PostManager = await retry(async () => {
    return await PostManagerFactory.deploy();
  }, 3, 2000);
  
  console.log("⏳ Waiting for deployment confirmation...");
  const deploymentReceipt = await postManager.waitForDeployment();
  
  const contractAddress = await postManager.getAddress();
  const receipt = await postManager.deploymentTransaction()?.wait();
  
  const deploymentInfo: DeploymentResult = {
    contractAddress,
    network: await ethers.provider.getNetwork(),
    deployer: deployer.address,
    blockNumber: await ethers.provider.getBlockNumber(),
    timestamp: new Date().toISOString(),
    gasUsed: receipt?.gasUsed,
    deploymentCost: receipt ? ethers.formatEther(receipt.gasUsed * receipt.gasPrice) : undefined
  };
  
  console.log("✅ PostManager deployed successfully!");
  console.log("📍 Contract address:", contractAddress);
  console.log("⛽ Gas used:", deploymentInfo.gasUsed?.toString());
  console.log("💰 Deployment cost:", deploymentInfo.deploymentCost, "ETH");
  
  // Verify initial state
  console.log("📊 Initial post count:", await postManager.postCount());
  
  return deploymentInfo;
}

async function main(): Promise<string> {
  const isDryRun = process.argv.includes("--dry");
  
  if (isDryRun) {
    console.log("🧪 Dry run mode - estimating gas costs only");
    await estimateGas();
    return "dry-run";
  }
  
  const deploymentResult = await deployContract();
  
  // Auto-verify on testnet
  await verifyContract(deploymentResult.contractAddress);
  
  console.log("\n🎉 Deployment Summary:");
  console.log("=" .repeat(50));
  console.log(`📍 Contract Address: ${deploymentResult.contractAddress}`);
  console.log(`🌐 Network: ${deploymentResult.network.name} (${deploymentResult.network.chainId})`);
  console.log(`👤 Deployer: ${deploymentResult.deployer}`);
  console.log(`📦 Block Number: ${deploymentResult.blockNumber}`);
  console.log(`⏰ Timestamp: ${deploymentResult.timestamp}`);
  console.log("=" .repeat(50));
  
  // Send success notification
  await sendWebhookNotification('success', deploymentResult);
  
  return deploymentResult.contractAddress;
}

// Execute deployment
main()
  .then(async (contractAddress) => {
    if (contractAddress !== "dry-run") {
      console.log("🎯 Deployment successful!");
      console.log("📋 Contract address:", contractAddress);
    }
    process.exit(0);
  })
  .catch(async (error) => {
    console.error("❌ Deployment failed:", error);
    await sendWebhookNotification('failure', undefined, error);
    process.exit(1);
  });