import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/utils';
import { WalletConnect } from '@/components/wallet-connect';
import * as wagmi from 'wagmi';

// wagmiフックのモック
vi.mock('wagmi');

describe('WalletConnect', () => {
  const mockUseAccount = vi.mocked(wagmi.useAccount);
  const mockUseConnect = vi.mocked(wagmi.useConnect);
  const mockUseDisconnect = vi.mocked(wagmi.useDisconnect);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when wallet is not connected', () => {
    beforeEach(() => {
      mockUseAccount.mockReturnValue({
        address: undefined,
        isConnected: false,
      } as any);

      mockUseConnect.mockReturnValue({
        connect: vi.fn(),
        connectors: [
          { uid: 'injected', name: 'MetaMask' },
          { uid: 'walletConnect', name: 'WalletConnect' },
        ],
        isPending: false,
      } as any);

      mockUseDisconnect.mockReturnValue({
        disconnect: vi.fn(),
      } as any);
    });

    it('shows wallet connection options', () => {
      render(<WalletConnect />);

      expect(screen.getByText('ウォレットを接続')).toBeInTheDocument();
      expect(screen.getByText('MetaMask')).toBeInTheDocument();
      expect(screen.getByText('WalletConnect')).toBeInTheDocument();
    });

    it('calls connect when connector button is clicked', async () => {
      const connectMock = vi.fn();
      mockUseConnect.mockReturnValue({
        connect: connectMock,
        connectors: [{ uid: 'injected', name: 'MetaMask' }],
        isPending: false,
      } as any);

      render(<WalletConnect />);

      const metaMaskButton = screen.getByText('MetaMask');
      await metaMaskButton.click();

      expect(connectMock).toHaveBeenCalledWith({
        connector: expect.objectContaining({ name: 'MetaMask' }),
      });
    });

    it('shows loading state when connecting', () => {
      mockUseConnect.mockReturnValue({
        connect: vi.fn(),
        connectors: [{ uid: 'injected', name: 'MetaMask' }],
        isPending: true,
      } as any);

      render(<WalletConnect />);

      expect(screen.getByText('接続中...')).toBeInTheDocument();
    });
  });

  describe('when wallet is connected', () => {
    const mockAddress = '0x1234567890123456789012345678901234567890';

    beforeEach(() => {
      mockUseAccount.mockReturnValue({
        address: mockAddress,
        isConnected: true,
      } as any);

      mockUseDisconnect.mockReturnValue({
        disconnect: vi.fn(),
      } as any);
    });

    it('shows connected state with address', () => {
      render(<WalletConnect />);

      expect(screen.getByText('接続済み: 0x1234...7890')).toBeInTheDocument();
      expect(screen.getByText('切断')).toBeInTheDocument();
    });

    it('calls disconnect when disconnect button is clicked', async () => {
      const disconnectMock = vi.fn();
      mockUseDisconnect.mockReturnValue({
        disconnect: disconnectMock,
      } as any);

      render(<WalletConnect />);

      const disconnectButton = screen.getByText('切断');
      await disconnectButton.click();

      expect(disconnectMock).toHaveBeenCalled();
    });

    it('does not show connection options when connected', () => {
      render(<WalletConnect />);

      expect(screen.queryByText('ウォレットを接続')).not.toBeInTheDocument();
      expect(screen.queryByText('MetaMask')).not.toBeInTheDocument();
    });
  });
});
