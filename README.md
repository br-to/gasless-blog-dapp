# gasless-blog-dapp

ガスレスブログDApp - Web3技術を活用した次世代ブログプラットフォーム。メタトランザクション機能により、ユーザーはガス代を支払うことなくブログの投稿・編集が可能。

## 📋 Contract Addresses

### Sepolia Testnet
- **PostManager**: TBD (デプロイ後に更新)
- **Etherscan**: TBD (デプロイ後に更新)

## 🚀 Development & Deployment

### Local Development
```bash
# Install dependencies
npm install

# Compile contracts
npm run compile

# Run tests
npm run test

# Start local Hardhat node
npm run node

# Deploy to localhost
npm run deploy:local
```

### Testnet Deployment

#### 1. Environment Setup
```bash
# Copy environment file
cp .env.example .env

# Edit .env with your keys
PRIVATE_KEY=your_private_key_here
SEPOLIA_URL=https://sepolia.infura.io/v3/your_infura_project_id
ETHERSCAN_API_KEY=your_etherscan_api_key
```

#### 2. Dry Run (Gas Estimation)
```bash
# Estimate gas costs before deployment
npm run deploy:testnet -- --dry
```

#### 3. Actual Deployment
```bash
# Deploy to Sepolia testnet
npm run deploy:testnet
```

### Additional Commands
```bash
# Generate gas report
npm run gas-report

# Check contract sizes
npm run size

# Manual verification
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

## 🔧 Features

- **Zero Gas Transactions**: メタトランザクションによるガスレス投稿
- **IPFS Integration**: 分散型ストレージでのブログ投稿保存
- **Auto Verification**: テストネットへの自動コントラクト検証
- **Retry Logic**: RPC混雑時のリトライ機能
- **Gas Estimation**: デプロイ前のガス見積もり
