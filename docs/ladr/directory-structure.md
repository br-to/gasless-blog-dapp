# LADR: ディレクトリ構成の最適化

## ステータス
承認済み

## 作成日
2025年7月14日

## 背景
ガスレスブログDAppプロジェクトにおいて、スマートコントラクト（Hardhat）とフロントエンド（Next.js）を含むモノレポ構成の最適なディレクトリ構造を確立する必要がある。現在の構造は基本的な構成となっているが、プロジェクトの成長と保守性を考慮した最適化が必要。

## 決定
以下のディレクトリ構成を採用する：

### ルートレベル（Hardhat + 共通設定）
```
gasless-blog-dapp/
├── README.md                     # プロジェクト全体の説明
├── package.json                  # モノレポのルート設定（Hardhat含む）
├── tsconfig.json                 # 共通TypeScript設定
├── hardhat.config.ts             # Hardhat設定
├── .gitignore                    # Git無視ファイル
├── .env.example                  # 環境変数のサンプル
├── contracts/                    # スマートコントラクトソース
│   ├── interfaces/               # コントラクトインターフェース
│   │   ├── IBlogPost.sol
│   │   ├── IUserRegistry.sol
│   │   └── IGaslessExecutor.sol
│   ├── core/                     # コアコントラクト
│   │   ├── BlogPost.sol
│   │   ├── UserRegistry.sol
│   │   └── AccessControl.sol
│   ├── gasless/                  # ガスレス機能
│   │   ├── GaslessExecutor.sol
│   │   ├── MetaTransaction.sol
│   │   └── Forwarder.sol
│   ├── libraries/                # 共通ライブラリ
│   │   ├── MetaTransactionUtils.sol
│   │   └── SignatureVerifier.sol
│   └── mocks/                    # テスト用モック
│       ├── MockERC20.sol
│       └── MockForwarder.sol
├── scripts/                      # デプロイ・管理スクリプト
│   ├── deploy/
│   │   ├── 00-deploy-registry.ts
│   │   ├── 01-deploy-blog.ts
│   │   └── 02-deploy-gasless.ts
│   ├── verify/
│   │   └── verify-contracts.ts
│   └── utils/
│       ├── network-config.ts
│       └── deployment-utils.ts
├── test/                         # コントラクトテスト
│   ├── unit/                     # 単体テスト
│   │   ├── BlogPost.test.ts
│   │   ├── UserRegistry.test.ts
│   │   └── GaslessExecutor.test.ts
│   ├── integration/              # 結合テスト
│   │   ├── BlogFlow.test.ts
│   │   └── GaslessFlow.test.ts
│   ├── fixtures/                 # テスト用データ
│   │   └── blog-fixtures.ts
│   └── utils/                    # テストユーティリティ
│       └── test-helpers.ts
├── deployments/                  # デプロイメント記録
│   ├── localhost/
│   ├── sepolia/
│   └── mainnet/
└── cache/                        # Hardhatキャッシュ
```
```

### フロントエンド
```
frontend/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/               # 認証が必要なページ
│   │   │   ├── dashboard/
│   │   │   └── create/
│   │   ├── blog/                 # ブログ関連ページ
│   │   │   ├── [id]/
│   │   │   └── page.tsx
│   │   ├── api/                  # API Routes
│   │   │   ├── auth/
│   │   │   └── gasless/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   └── not-found.tsx
│   ├── components/               # React コンポーネント
│   │   ├── ui/                   # 基本UIコンポーネント
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   └── badge.tsx
│   │   ├── layout/               # レイアウトコンポーネント
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   └── sidebar.tsx
│   │   ├── blog/                 # ブログ関連コンポーネント
│   │   │   ├── post-card.tsx
│   │   │   ├── post-editor.tsx
│   │   │   └── post-list.tsx
│   │   ├── wallet/               # ウォレット関連コンポーネント
│   │   │   ├── wallet-connect.tsx
│   │   │   ├── wallet-info.tsx
│   │   │   └── network-switcher.tsx
│   │   └── providers/            # Context Provider
│   │       ├── wallet-provider.tsx
│   │       └── query-provider.tsx
│   ├── hooks/                    # カスタムフック
│   │   ├── useWallet.ts
│   │   ├── useBlogPosts.ts
│   │   ├── useGaslessTransaction.ts
│   │   └── useMetaTransaction.ts
│   ├── lib/                      # ライブラリ・ユーティリティ
│   │   ├── contracts/            # コントラクト関連
│   │   │   ├── abis/             # ABI定義
│   │   │   ├── addresses.ts      # コントラクトアドレス
│   │   │   └── types.ts          # TypeChain生成型
│   │   ├── wagmi.ts              # Wagmi設定
│   │   ├── utils.ts              # 汎用ユーティリティ
│   │   ├── constants.ts          # 定数
│   │   └── validations.ts        # バリデーション
│   ├── store/                    # 状態管理
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   └── blogSlice.ts
│   │   └── index.ts
│   ├── styles/                   # スタイル
│   │   ├── globals.css
│   │   └── components.css
│   └── types/                    # 型定義
│       ├── blog.ts
│       ├── user.ts
│       └── contract.ts
├── test/                         # フロントエンドテスト
│   ├── components/               # コンポーネントテスト
│   ├── hooks/                    # フックテスト
│   ├── pages/                    # ページテスト
│   ├── utils/                    # テストユーティリティ
│   └── setup.ts                  # テスト設定
├── public/                       # 静的ファイル
│   ├── images/
│   ├── icons/
│   └── favicon.ico
├── components.json               # shadcn/ui設定
├── next.config.js               # Next.js設定
├── tailwind.config.js           # Tailwind CSS設定
├── vitest.config.ts             # Vitest設定
├── biome.json                   # Biome設定
├── package.json                 # フロントエンド依存関係
└── tsconfig.json               # TypeScript設定
```

### 共通・その他
```
docs/                            # ドキュメント
├── ladr/                        # 軽量アーキテクチャ決定記録
├── api/                         # API仕様書
├── deployment/                  # デプロイメントガイド
└── user-guide/                  # ユーザーガイド

tools/                           # 開発ツール
├── scripts/                     # 便利スクリプト
│   ├── generate-types.sh
│   ├── setup-env.sh
│   └── deploy-all.sh
└── configs/                     # 共通設定
    ├── eslint.config.js
    └── prettier.config.js

.github/                         # GitHub関連
├── workflows/                   # CI/CD
│   ├── contracts.yml
│   ├── frontend.yml
│   └── integration.yml
├── ISSUE_TEMPLATE/
└── PULL_REQUEST_TEMPLATE.md

cache/                           # ビルドキャッシュ
├── hardhat/                     # Hardhatキャッシュ
└── next/                        # Next.jsキャッシュ（フロントエンド用）

node_modules/                    # 依存関係（gitignore）
```

## 理由
1. **機能別分離**: コントラクトとフロントエンドを明確に分離し、それぞれの責務を明確化
2. **スケーラビリティ**: プロジェクトの成長に対応できる構造
3. **開発効率**: 関連ファイルの近接配置による開発効率の向上
4. **テスト容易性**: テストファイルの体系的配置
5. **CI/CD対応**: 自動化に適した構造
6. **モノレポ最適化**: 共通設定と個別設定の適切な分離

## 利点
- 新しい開発者のオンボーディングが容易
- ファイルの検索・配置が直感的
- テストとソースコードの関連性が明確
- デプロイメントの自動化が容易
- コードレビューの効率化

## 欠点
- 初期のディレクトリ移行作業が必要
- 一部のツール設定の更新が必要

## 移行計画
1. 段階的移行（機能単位）
2. テスト環境での動作確認
3. CI/CDパイプラインの更新
4. ドキュメントの更新

## 注意事項
- パスの変更に伴うimport文の更新が必要
- 設定ファイルのパス更新が必要
- 既存のデプロイメントスクリプトの調整が必要
