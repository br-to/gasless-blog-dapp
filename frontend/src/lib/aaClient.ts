import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';

// Bundler URL（UserOperationを処理するバンドラーサービスのエンドポイント）
export const bundlerUrl = process.env.NEXT_PUBLIC_BUNDLER_URL;

// EntryPoint アドレス（ERC-4337 v0.6 標準のエントリーポイント）
export const entryPoint = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';

// 署名者の設定（Smart Accountの所有者）
export const signer = privateKeyToAccount(
  process.env.PRIVATE_KEY as `0x${string}`
);

// ブロックチェーンデータ読み取り用のパブリッククライアント
export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

// 署名者付きのウォレットクライアント
export const walletClient = createWalletClient({
  account: signer,
  chain: sepolia,
  transport: http(),
});
