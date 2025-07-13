import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

// Test用のWrapper（将来的にProvidersを追加する場合用）
interface AllProvidersProps {
  children: React.ReactNode;
}

const AllProviders = ({ children }: AllProvidersProps) => {
  return <>{children}</>;
};

// カスタムrender関数
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options });

// よく使うテストユーティリティ
export const createMockAccount = (address?: string) => ({
  address: address || '0x1234567890123456789012345678901234567890',
  isConnected: true,
  isConnecting: false,
  isDisconnected: false,
});

export const createMockBalance = (value?: string) => ({
  data: {
    decimals: 18,
    formatted: value || '1.0',
    symbol: 'ETH',
    value: BigInt(value || '1000000000000000000'),
  },
  error: null,
  isLoading: false,
});

// re-export everything
export * from '@testing-library/react';
export { customRender as render };
