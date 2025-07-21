import { createModularAccountAlchemyClient } from '@account-kit/smart-contracts';
import { LocalAccountSigner } from '@aa-sdk/core';
import { sepolia, alchemy } from '@account-kit/infra';

/**
 * Smart Accountを作成する関数
 */
async function createAccount() {
  try {
    console.log('🚀 Smart Account作成を開始します...');

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

    // Account Kit SDK を使用してSmart Account Clientを作成
    const smartAccountClient = await createModularAccountAlchemyClient({
      transport: alchemy({
        apiKey: process.env.ALCHEMY_API_KEY,
      }),
      chain: sepolia,
      signer,
    });

    // Smart Accountアドレスの取得
    const smartAccountAddress = smartAccountClient.getAddress();

    console.log('✅ Smart Account作成完了！');
    console.log('📍 Smart Accountアドレス:', smartAccountAddress);
    console.log('🔑 所有者アドレス:', await signer.getAddress());
    console.log('🌐 ネットワーク:', sepolia.name);
    console.log('🎯 EntryPoint:', smartAccountClient.account.getEntryPoint());

    // アカウント情報の確認
    const accountDeployed =
      await smartAccountClient.account.isAccountDeployed();

    if (accountDeployed) {
      console.log('🎉 Smart Accountは既にデプロイ済みです');
    } else {
      console.log('⏳ Smart Accountは初回取引時にデプロイされます');
    }

    return smartAccountAddress;
  } catch (error) {
    console.error('❌ Smart Account作成エラー:', error);
    throw error;
  }
}

// スクリプト実行
if (require.main === module) {
  createAccount()
    .then((address) => {
      console.log('🎯 最終結果 - Smart Accountアドレス:', address);
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 スクリプト実行失敗:', error);
      process.exit(1);
    });
}

export { createAccount };
