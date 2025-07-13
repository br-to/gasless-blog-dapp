# LADR-004: ESLintからBiomeへのLinter移行

## ステータス
承認済み

## 日付
2025-07-13

## 背景
現在のプロジェクトでは以下のlinter設定を使用している：
- ESLint v8
- eslint-config-next v15.0.0
- Next.js標準のlint設定

しかし、より高速で統一されたツールチェーンを求めて、Biomeへの移行を検討する。

## 課題
1. **パフォーマンス**: ESLintは大規模なプロジェクトで動作が重い
2. **設定の複雑さ**: ESLint + Prettier の設定が煩雑
3. **一貫性**: lintingとformattingが別ツールで一貫性に欠ける
4. **メンテナンス**: 複数の設定ファイルの管理が必要

## 決定
ESLintからBiomeに移行する

## 理由
### Biomeの利点
1. **高速性**: Rustで書かれており、ESLintより大幅に高速
2. **統一性**: linting + formatting + import sortingが一つのツールで完結
3. **設定の簡潔性**: 単一の設定ファイル（biome.json）で管理
4. **Next.js対応**: React/TypeScript/JSXのサポートが充実
5. **移行のしやすさ**: ESLintルールとの互換性が高い

### 考慮したリスク
1. **エコシステムの成熟度**: ESLintほど成熟していない
2. **プラグインの制限**: カスタムルールの制約
3. **チーム慣れ**: 新しいツールへの学習コスト

## 影響範囲
- `package.json`の依存関係
- npm scripts
- CI/CDパイプライン
- エディター設定（VS Code settings）
- 開発ワークフロー

## 移行計画
1. Biomeのインストール
2. 基本設定ファイル作成
3. ESLint関連パッケージの削除
4. npm scriptsの更新
5. CI設定の更新
6. エディター設定の更新

## 期待される結果
- linting実行時間の短縮（50-90%の改善予想）
- 設定ファイルの簡素化
- formatting + lintingの一貫性向上
- 開発体験の向上

## 代替案
1. **ESLint継続**: 現状維持だが、パフォーマンス問題は残る
2. **ESLint + Prettier最適化**: 設定改善だが根本的解決にならない
3. **段階的移行**: 一部ファイルのみBiome導入だが、複雑性が増す

## 関連資料
- [Biome公式ドキュメント](https://biomejs.dev/)
- [ESLintからBiomeへの移行ガイド](https://biomejs.dev/guides/migrate-eslint-prettier/)
- [Next.js + Biome設定例](https://biomejs.dev/recipes/next-js/)
