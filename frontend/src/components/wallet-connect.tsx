'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="flex items-center gap-4">
        <Badge variant="secondary" className="text-sm">
          接続済み: {address?.slice(0, 6)}...{address?.slice(-4)}
        </Badge>
        <Button variant="destructive" size="sm" onClick={() => disconnect()}>
          切断
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm font-medium">ウォレットを接続</div>
      {connectors.map((connector) => (
        <Button
          key={connector.uid}
          variant="default"
          size="sm"
          onClick={() => connect({ connector })}
          disabled={isPending}
        >
          {isPending ? '接続中...' : connector.name}
        </Button>
      ))}
    </div>
  );
}
