import { Button } from "@/components/ui/button"
import { WalletConnect } from "@/components/wallet-connect"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <main className="flex max-w-4xl flex-col items-center gap-8 text-center">
        <div className="absolute top-8 right-8">
          <WalletConnect />
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Gasless Blog DApp
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          次世代のガスレス・ブログプラットフォームへようこそ。
          Web3技術を活用した新しいブログ体験を提供します。
        </p>
        <div className="flex gap-4 flex-col sm:flex-row">
          <Button size="lg" className="px-8">
            ブログを始める
          </Button>
          <Button variant="outline" size="lg" className="px-8">
            詳細を見る
          </Button>
        </div>
      </main>
    </div>
  )
}
