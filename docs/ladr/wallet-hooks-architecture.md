# LADR-005: ウォレット接続アーキテクチャ（wagmi v2 + viem v2）

## ステータス
承認済み

## 日付
2025-07-14

## 背景
ガスレスブログDAppにおいて、ユーザーのEthereumウォレット接続とWeb3インタラクションを実現するためのアーキテクチャが必要である。以下の要件を満たす技術スタックの選定を行う：

- 多様なウォレット（MetaMask、WalletConnect、Coinbase Wallet等）への対応
- 型安全なブロックチェーンインタラクション
- React Server Components（RSC）との互換性
- モダンなReact hooksパターンでの状態管理
- ガスレス取引（meta-transaction）の実装サポート
- パフォーマンスと開発者体験の最適化

## 決定事項
以下の技術スタックを採用する：

### 1. wagmi v2
- **理由**:
  - React専用のWeb3フックライブラリで最新のReactパターンに対応
  - 型安全なEthereumインタラクション（TypeScript完全サポート）
  - TanStack Queryベースのキャッシュとデータ同期
  - React Server Components（RSC）との互換性
  - 豊富なウォレットコネクタ（MetaMask、WalletConnect、Coinbase Wallet等）
  - ガスレス取引やアカウント抽象化の対応
  - アクティブなメンテナンスと豊富なコミュニティ

### 2. viem v2
- **理由**:
  - TypeScript-firstのEthereumライブラリ
  - 軽量で高性能（ethers.jsより30-40%高速）
  - 完全な型安全性（ABIから自動型生成）
  - モジュラー設計で必要な機能のみをインポート可能
  - wagmi v2のコアライブラリとして最適化
  - JSON-RPC仕様との完全準拠
  - 最新のEIP（Ethereum Improvement Proposals）への迅速な対応

### 3. 主要な構成コンポーネント
- **@wagmi/core**: コアwagmi機能
- **@wagmi/connectors**: 各種ウォレットコネクタ
- **viem**: 低レベルEthereumインタラクション
- **@tanstack/react-query**: データフェッチと状態管理（wagmiの依存関係）

## アーキテクチャ設計

### プロバイダー構成
```typescript
// app/providers.tsx
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from '@/lib/wagmi'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

### ウォレット接続設定
```typescript
// lib/wagmi.ts
import { createConfig, http } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { metaMask, walletConnect, coinbaseWallet } from 'wagmi/connectors'

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    metaMask(),
    walletConnect({ projectId: 'YOUR_PROJECT_ID' }),
    coinbaseWallet({ appName: 'Gasless Blog DApp' }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})
```

### フック活用パターン
- `useAccount()`: アカウント情報の取得
- `useConnect()`: ウォレット接続
- `useDisconnect()`: ウォレット切断
- `useBalance()`: 残高取得
- `useContractRead()`: コントラクト読み込み
- `useContractWrite()`: コントラクト書き込み
- `useTransaction()`: トランザクション追跡

## メリット

### 開発者体験
- **型安全性**: TypeScriptでの完全な型サポート
- **自動補完**: IDEでの優れた開発支援
- **デバッグ**: React DevToolsでの状態デバッグ
- **キャッシュ**: 自動的なデータキャッシュと同期

### パフォーマンス
- **軽量**: viemによる最適化されたバンドルサイズ
- **高速**: 最適化されたJSON-RPC通信
- **効率的**: 必要なデータのみのフェッチとキャッシュ

### ユーザー体験
- **マルチウォレット**: 多様なウォレットへの対応
- **自動再接続**: ページリロード時の自動ウォレット再接続
- **エラーハンドリング**: 一貫したエラー処理パターン

## 代替案
検討された代替案：

### ethers.js + React Context
- **メリット**: 実績豊富、学習コストが低い
- **デメリット**:
  - 手動での状態管理が必要
  - 型安全性が限定的
  - React Server Componentsとの統合が困難
  - バンドルサイズが大きい

### web3.js + カスタムhooks
- **メリット**: 歴史が長く安定
- **デメリット**:
  - TypeScriptサポートが不完全
  - モダンなReactパターンへの対応が不十分
  - パフォーマンスの最適化が困難

### RainbowKit + ethers.js
- **メリット**: 美しいUI、簡単な導入
- **デメリット**:
  - wagmi v2ほどの柔軟性がない
  - 最新のReact機能への対応が遅れる
  - カスタマイズが制限される

## 実装フェーズ

### Phase 1: 基本セットアップ
- wagmi、viem、必要な依存関係のインストール
- 基本的なプロバイダー設定
- ウォレット接続UIコンポーネント

### Phase 2: コントラクトインタラクション
- スマートコントラクトとの型安全な通信
- ブログ投稿・読み込み機能の実装
- トランザクション状態管理

### Phase 3: ガスレス機能
- meta-transactionの実装
- リレイヤーとの統合
- ユーザー体験の最適化

### Phase 4: 高度な機能
- ENS名前解決
- マルチチェーン対応
- オフライン対応とキャッシュ戦略

## リスク評価

### 技術リスク
- **学習コストの中程度**: 新しいAPIパターンへの慣れが必要
- **依存関係の管理**: TanStack Queryとの適切な統合

### 緩和策
- 段階的な導入とプロトタイプ検証
- 包括的なドキュメント化
- TypeScriptによる実行時エラーの削減

## 関連資料
- [wagmi公式ドキュメント](https://wagmi.sh/)
- [viem公式ドキュメント](https://viem.sh/)
- [WalletConnectプロジェクトID取得](https://cloud.walletconnect.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [EIP-2771: Meta Transactions](https://eips.ethereum.org/EIPS/eip-2771)
