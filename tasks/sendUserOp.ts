import { task } from 'hardhat/config';
import { parseEther, formatEther, isHex } from 'viem';
import { createSmartAccountClient } from '../scripts/utils/smartAccountClient';

/**
 * UserOperationを送信するHardhat Task
 * 使用例:
 * npx hardhat sendUserOp --network sepolia --data "0x1234abcd"
 * npx hardhat sendUserOp --network sepolia --data "0x1234abcd" --value "0.001"
 * npx hardhat sendUserOp --network sepolia --data "0x1234abcd" --target "0x..." --dryrun
 */
task('sendUserOp', 'Send a UserOperation with custom data')
  .addParam('data', 'Hex data to include in the UserOperation (e.g., "0x1234abcd")')
  .addOptionalParam('value', 'ETH value to send (default: "0")', '0')
  .addOptionalParam('target', 'Target contract address (default: Smart Account address)')
  .addFlag('dryrun', 'Simulate without actually sending the transaction')
  .setAction(async (taskArgs, hre) => {
    try {
      console.log('🚀 UserOperation送信タスクを開始します...');
      console.log('📋 パラメータ:');
      console.log('  - data:', taskArgs.data);
      console.log('  - value:', taskArgs.value, 'ETH');
      console.log('  - target:', taskArgs.target || 'Smart Account (自分自身)');
      console.log('  - dryrun:', taskArgs.dryrun ? 'はい' : 'いいえ');

      // データの妥当性チェック
      if (!isHex(taskArgs.data)) {
        throw new Error(`無効なhexデータ: ${taskArgs.data}`);
      }

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

      // パラメータ設定
      const value = parseEther(taskArgs.value);
      const targetAddress = taskArgs.target || smartAccountAddress;
      const data = taskArgs.data as `0x${string}`;

      // 最小必要残高のチェック
      const minimumBalance = parseEther('0.001');
      if (balance < minimumBalance) {
        throw new Error(
          `残高不足: 現在 ${balanceFormatted} ETH、最低 ${formatEther(minimumBalance)} ETH が必要です。`
        );
      }

      console.log('\n📝 UserOperation詳細:');
      console.log('  - 送金先:', targetAddress);
      console.log('  - 金額:', formatEther(value), 'ETH');
      console.log('  - データ:', data);
      console.log('  - データサイズ:', (data.length - 2) / 2, 'bytes');

      if (taskArgs.dryrun) {
        console.log('\n✅ Dry-run完了 - 実際の送信はスキップされました');
        return {
          success: true,
          dryrun: true,
          smartAccountAddress,
          targetAddress,
          value: formatEther(value),
          data,
          balance: balanceFormatted,
        };
      }

      // UserOperationを実行
      console.log('\n⏳ UserOpを送信中...');
      const userOpResult = await smartAccountClient.sendUserOperation({
        uo: {
          target: targetAddress,
          data: data,
          value: value,
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
      console.log('📋 結果:', txReceipt);

      // 実行後の残高確認
      const newBalance = await smartAccountClient.getBalance({
        address: smartAccountAddress,
      });
      console.log('💰 実行後残高:', formatEther(newBalance), 'ETH');

      // ガス使用量の計算
      const gasUsed = balance - newBalance - value;
      console.log('⛽ ガス使用量:', formatEther(gasUsed), 'ETH');

      console.log('\n🎯 最終結果:');
      console.log('  - UserOp Hash:', userOpResult.hash);
      console.log('  - Transaction Hash:', txReceipt);
      console.log('  - 実行成功: はい');
      console.log('  - 実行前残高:', balanceFormatted, 'ETH');
      console.log('  - 実行後残高:', formatEther(newBalance), 'ETH');
      console.log('  - ガス使用量:', formatEther(gasUsed), 'ETH');

      return {
        success: true,
        userOpHash: userOpResult.hash,
        txHash: txReceipt,
        smartAccountAddress,
        targetAddress,
        value: formatEther(value),
        data,
        balanceBefore: balanceFormatted,
        balanceAfter: formatEther(newBalance),
        gasUsed: formatEther(gasUsed),
      };
    } catch (error) {
      console.error('❌ UserOperation送信エラー:', error);
      throw error;
    }
  });
