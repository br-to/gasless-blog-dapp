import { createSmartAccountClient } from './utils/smartAccountClient';
import { parseEther, formatEther } from 'viem';

/**
 * UserOpを送信してダミーWrite操作を実行する関数
 */
async function executeCall() {
  try {
    console.log('🚀 UserOp送信テストを開始します...');

    // Smart Account Clientの作成
    const smartAccountClient = await createSmartAccountClient();
    const smartAccountAddress = smartAccountClient.getAddress();
    console.log('📍 Smart Accountアドレス:', smartAccountAddress);

    // 残高確認
    const balance = await smartAccountClient.getBalance({
      address: smartAccountAddress,
    });
    const balanceFormatted = formatEther(balance);
    console.log('💰 Smart Account残高:', balanceFormatted, 'ETH');

    // 最小必要残高のチェック
    const minimumBalance = parseEther('0.005'); // 最低0.005 ETH必要
    if (balance < minimumBalance) {
      throw new Error(
        `残高不足: 現在 ${balanceFormatted} ETH、最低 ${formatEther(
          minimumBalance
        )} ETH が必要です。`
      );
    }

    // より少額のダミー操作に変更
    const dummyAmount = parseEther('0.0001'); // 0.0001 ETH
    const targetAddress = smartAccountAddress;

    console.log('📝 UserOp詳細:');
    console.log('  - 操作: ETH送金（ダミーWrite）');
    console.log('  - 送金先:', targetAddress);
    console.log('  - 金額:', formatEther(dummyAmount), 'ETH');
    console.log(
      '  - 推定残高（実行後）:',
      formatEther(balance - dummyAmount),
      'ETH'
    );

    // UserOperationを実行
    console.log('⏳ UserOpを送信中...');
    const userOpResult = await smartAccountClient.sendUserOperation({
      uo: {
        target: targetAddress,
        data: '0x',
        value: dummyAmount,
      },
    });

    console.log('✅ UserOp送信完了！');
    console.log('🔗 UserOp Hash:', userOpResult.hash);

    // トランザクション完了を待機
    console.log('⏳ トランザクション完了を待機中...');
    const txReceipt = await smartAccountClient.waitForUserOperationTransaction({
      hash: userOpResult.hash,
    });

    console.log('🎉 トランザクション完了！');
    console.log('📋 結果:');
    console.log('  - Tx Hash:', txReceipt);

    // 実行後の残高確認
    const newBalance = await smartAccountClient.getBalance({
      address: smartAccountAddress,
    });
    console.log('💰 実行後残高:', formatEther(newBalance), 'ETH');

    // ガス使用量の計算
    const gasUsed = balance - newBalance - dummyAmount;
    console.log('⛽ ガス使用量:', formatEther(gasUsed), 'ETH');

    return {
      userOpHash: userOpResult.hash,
      txHash: txReceipt,
      success: true,
      balanceBefore: balanceFormatted,
      balanceAfter: formatEther(newBalance),
      gasUsed: formatEther(gasUsed),
    };
  } catch (error) {
    console.error('❌ UserOp送信エラー:', error);
    throw error;
  }
}

// スクリプト実行
if (require.main === module) {
  executeCall()
    .then((result) => {
      console.log('\n🎯 最終結果:');
      console.log('  - UserOp Hash:', result?.userOpHash);
      console.log('  - Transaction Hash:', result?.txHash);
      console.log('  - 実行成功:', result?.success ? 'はい' : 'いいえ');
      console.log('  - 実行前残高:', result?.balanceBefore, 'ETH');
      console.log('  - 実行後残高:', result?.balanceAfter, 'ETH');
      console.log('  - ガス使用量:', result?.gasUsed, 'ETH');
      console.log('\n🎉 Account Abstraction (AA) のテストが完了しました！');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 スクリプト実行失敗:', error);
      process.exit(1);
    });
}

export { executeCall };
