import { createSmartAccountClient } from './utils/smartAccountClient';

/**
 * Smart Accountを作成する関数
 */
async function createAccount() {
  try {
    console.log('🚀 Smart Account作成を開始します...');

    // Smart Account Clientの作成
    const smartAccountClient = await createSmartAccountClient();
    const smartAccountAddress = smartAccountClient.getAddress();

    console.log('✅ Smart Account作成完了！');
    console.log('📍 Smart Accountアドレス:', smartAccountAddress);

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
