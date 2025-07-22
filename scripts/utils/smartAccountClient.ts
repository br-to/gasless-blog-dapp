import { createModularAccountAlchemyClient } from '@account-kit/smart-contracts';
import { LocalAccountSigner } from '@aa-sdk/core';
import { sepolia, alchemy } from '@account-kit/infra';

/**
 * Smart Account Clientを作成する共通関数
 */
export async function createSmartAccountClient(): Promise<
  ReturnType<typeof createModularAccountAlchemyClient>
> {
  // 環境変数の確認
  if (!process.env.PRIVATE_KEY) {
    throw new Error('PRIVATE_KEY 環境変数が設定されていません');
  }
  if (!process.env.ALCHEMY_API_KEY) {
    throw new Error('ALCHEMY_API_KEY 環境変数が設定されていません');
  }

  // 署名者の作成
  const signer = LocalAccountSigner.privateKeyToAccountSigner(
    process.env.PRIVATE_KEY as `0x${string}`
  );

  // Smart Account Clientの作成
  const smartAccountClient = await createModularAccountAlchemyClient({
    transport: alchemy({
      apiKey: process.env.ALCHEMY_API_KEY,
    }),
    chain: sepolia,
    signer,
  });

  return smartAccountClient;
}
