# Gasless Blog DApp

ガスレスブログDAppは、IPFSを使用したコンテンツ保存とEthereumブロックチェーンを組み合わせた分散型ブログプラットフォームです。

## 🎯 概要

このプロジェクトは、ブログ投稿をIPFS/Bundlrに保存し、そのCID（Content Identifier）をEthereumのスマートコントラクトで管理する分散型アプリケーションです。

### 主な機能

- 📝 **分散型ブログ投稿**: IPFSを使用したコンテンツの分散保存
- ⛽ **ガスレス機能**: Meta-TransactionsまたはAccount Abstractionを使用
- 🔗 **ブロックチェーン統合**: Ethereum/Sepolia上でのデータ管理
- 🎨 **モダンフロントエンド**: Next.js + TypeScript + Tailwind CSS
- 🧪 **包括的テスト**: Hardhat + Vitest による自動テスト

## 🏗️ アーキテクチャ

```
├── contracts/          # Solidityスマートコントラクト
├── scripts/            # デプロイメントスクリプト
├── test/               # コントラクトテスト
├── frontend/           # Next.jsフロントエンド
├── typechain-types/    # TypeScript型定義（自動生成）
├── artifacts/          # コンパイル済みコントラクト
└── .github/workflows/  # CI/CDパイプライン
```

## 🚀 クイックスタート

### 前提条件

- Node.js 18.0.0以上
- npm または yarn
- Git

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/br-to/gasless-blog-dapp.git
cd gasless-blog-dapp

# 依存関係をインストール
npm install

# フロントエンドの依存関係をインストール
cd frontend && npm install && cd ..
```

### 環境設定

`.env`ファイルを作成し、必要な環境変数を設定：

```bash
# ネットワーク設定
SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
MAINNET_URL=https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID

# デプロイメント用プライベートキー（テスト用のみ）
PRIVATE_KEY=your_private_key_here

# Etherscan API（コントラクト検証用）
ETHERSCAN_API_KEY=your_etherscan_api_key

# ガスレポート用（オプション）
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key
REPORT_GAS=true
```

## 🔧 開発

### スマートコントラクト

```bash
# コンパイル
npm run compile

# テスト実行
npm run test

# ガスレポート付きテスト
npm run gas-report

# ローカルネットワーク起動
npm run node

# ローカルデプロイ
npm run deploy:local
```

### フロントエンド

```bash
# 開発サーバー起動
npm run frontend:dev

# または
cd frontend && npm run dev
```

### テスト

```bash
# コントラクトテスト
npm run test

# カバレッジレポート
npm run coverage

# フロントエンドテスト
cd frontend && npm run test
```

## 📋 デプロイメント

### テストネット（Sepolia）

```bash
# 手動デプロイ
npm run deploy:testnet

# GitHub Actionsでのデプロイ
# ドライラン（ガス見積もりのみ）
git push origin feat/deploy-testnet
# GitHub ActionsのUIから"Deploy to Sepolia"を実行し、dry_run=trueを選択

# 実際のデプロイ
# GitHub ActionsのUIから"Deploy to Sepolia"を実行し、dry_run=falseを選択
```

### メインネット

```bash
npm run deploy:mainnet
```

## 🎯 スマートコントラクト

### PostManager.sol

ブログ投稿の管理を行うメインコントラクト：

```solidity
// 投稿作成
function createPost(string calldata cid) external returns (uint256 postId)

// 投稿データ取得
function getPost(uint256 postId) external view returns (string memory cid)

// 著者取得
function getAuthor(uint256 postId) external view returns (address author)

// 投稿データと著者を同時取得
function getPostData(uint256 postId) external view returns (string memory cid, address author)
```

### 主要イベント

```solidity
event PostCreated(uint256 indexed id, address indexed author, string cid);
```

## 🛠️ 技術スタック

### バックエンド/ブロックチェーン
- **Solidity** ^0.8.28
- **Hardhat** - 開発フレームワーク
- **TypeChain** - 型安全なコントラクト操作
- **Ethers.js** v6 - Ethereum JavaScript ライブラリ

### フロントエンド
- **Next.js** 15.3.5 - React フレームワーク
- **TypeScript** - 型安全性
- **Tailwind CSS** - スタイリング
- **Radix UI** - UIコンポーネント
- **Wagmi** - Ethereum React フック
- **TanStack Query** - データフェッチング

### 開発ツール
- **Biome** - Linting & Formatting
- **Vitest** - テストフレームワーク
- **GitHub Actions** - CI/CD

## 📝 コントリビューション

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### 開発ガイドライン

- **コミットメッセージ**: [Conventional Commits](https://www.conventionalcommits.org/) に従う
- **コードスタイル**: Biomeの設定に従う
- **テスト**: 新機能には必ずテストを追加
- **ドキュメント**: 重要な変更はドキュメントも更新

## 📄 ライセンス

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 リンク

- [Hardhat Documentation](https://hardhat.org/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh/)
- [IPFS Documentation](https://docs.ipfs.io/)

## 📞 サポート

質問やサポートが必要な場合は、[Issues](https://github.com/br-to/gasless-blog-dapp/issues)を作成してください。
