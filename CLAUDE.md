# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ガスレスブログDApp - Web3技術を活用した次世代ブログプラットフォーム。メタトランザクション機能により、ユーザーはガス代を支払うことなくブログの投稿・編集が可能。

## Technology Stack

### Frontend (Next.js App)
- **Next.js v15.3.5** with App Router and experimental React Compiler
- **React 19** with Server Components and improved Suspense
- **shadcn/ui** design system with Radix UI primitives
- **Tailwind CSS v4.1.11** with CSS variables and dark mode support
- **TypeScript** with strict configuration
- **Biome v1.8.3** for linting, formatting, and import sorting
- **Vitest** for testing with happy-dom environment
- **Wagmi v2.15.6** + **Viem v2.31.7** for Ethereum integration

### Smart Contracts & Backend
- **Hardhat v2.25.0** development framework for Ethereum
- **Solidity v0.8.28** with optimizer enabled (200 runs)
- **OpenZeppelin Contracts v5.3.0** for secure implementations
- **ethers.js v6.15.0** for blockchain interactions

## Development Commands

### Frontend Development (run from frontend directory)
```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # Biome lint check
npm run format       # Biome format check
npm run check        # Biome comprehensive check
npm run check:fix    # Biome comprehensive check with auto-fix
npm run typecheck    # TypeScript validation
npm run test         # Run Vitest tests
```

### Smart Contract Development (run from root)
```bash
npm run compile      # Compile contracts with Hardhat
npm run test         # Run contract tests
npm run node         # Start local Hardhat node
npm run deploy:local # Deploy to local network
npm run deploy:testnet # Deploy to Sepolia testnet
```

## Project Architecture

### Directory Structure
```
gasless-blog-dapp/
├── frontend/          # Next.js v15 frontend application
│   ├── src/app/       # App Router pages and layout
│   ├── src/components/ # Reusable UI components (shadcn/ui)
│   ├── src/lib/       # Utilities and Wagmi configuration
│   └── src/test/      # Frontend tests (Vitest)
├── contracts/         # Solidity smart contracts (empty)
├── scripts/           # Deployment scripts (empty)
├── test/              # Contract tests (empty)
├── docs/ladr/         # Architecture Decision Records
├── hardhat.config.ts  # Hardhat configuration
└── package.json       # Root dependencies
```

### Key Configuration

**React Compiler**: Enabled in `frontend/next.config.js` for automatic optimization
**shadcn/ui**: Configured with TypeScript support, RSC, CSS variables, and paths (`@/*`)
**Wagmi**: Web3 integration with Ethereum Mainnet and Sepolia Testnet support
**Hardhat Networks**: localhost (31337), Sepolia (11155111), Mainnet, Polygon
**Performance Targets**: FCP <1.5s, LCP <2.5s, CLS <0.1, FID <100ms

### Design System

Uses shadcn/ui components with Tailwind CSS v4:
- Import path alias: `@/components` and `@/lib`
- Style utilities: Use `cn()` function from `@/lib/utils`
- Color system: HSL CSS variables with light/dark mode
- Components: Copy-paste approach, fully customizable

### Web3 Integration

**Wagmi Configuration** (`frontend/src/lib/wagmi.ts`):
- Ethereum Mainnet and Sepolia Testnet support
- Injected wallet, MetaMask, and WalletConnect connectors
- Type-safe blockchain interactions with Viem

**Smart Contract Development**:
- Named accounts: deployer (index 0), user1 (index 1), user2 (index 2)
- Solidity optimization: 200 runs with viaIR enabled
- Multi-network deployment support with environment variables

### Development Workflow

1. **Frontend**: Use Next.js App Router with React 19 Server Components
2. **Styling**: Apply shadcn/ui components with Tailwind v4 utilities
3. **Web3**: Integrate with Wagmi/Viem for blockchain interactions
4. **Testing**: Use Vitest for frontend tests, Hardhat for contracts
5. **Code Quality**: Biome for linting/formatting, strict TypeScript

### Architecture Decisions

See `docs/ladr/` for detailed technical decisions:
- `framework.md`: Frontend technology choices (Next.js 15, React 19, React Compiler)
- `blockChainFramework.md`: Blockchain development stack (Hardhat, OpenZeppelin)

## Implementation Status

**Completed**: Frontend setup with Next.js 15 + React 19, shadcn/ui integration, Wagmi Web3 setup, Hardhat environment configuration

**Pending**: Smart contracts implementation, deployment scripts, gasless functionality, comprehensive testing