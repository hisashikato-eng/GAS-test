# GAS Bots 初期構築リポジトリ

Slack と Notion を連携したタスク管理ボット群を Google Apps Script で開発するための初期セットアップです。GitHub Actions による自動デプロイを想定しており、今後の開発フェーズに合わせて機能を拡張できます。

## リポジトリ構成

```
.
├── src/
│   ├── appsscript.json
│   ├── Config.gs
│   ├── EventRouter.gs
│   ├── HealthCheck.gs
│   ├── NotionClient.gs
│   ├── Scheduler.gs
│   ├── SlackClient.gs
│   ├── TaskBriefingBot.gs
│   ├── TaskCheckBot.gs
│   └── TaskDetectBot.gs
├── docs/
│   └── system-overview.md
└── .github/
    └── workflows/
        ├── gasdeploy.yaml
        └── gas-rollback.yaml
```

## 開発の流れ

1. Google Apps Script プロジェクトを作成し、clasp でこのリポジトリと連携します。
2. `src` ディレクトリのファイルを編集して Slack/Notion 連携処理を実装します。
3. プルリクエストで「Approve」を押すかメインブランチへプッシュすると GitHub Actions (`gasdeploy.yaml`) が自動デプロイとヘルスチェックを実行します。
4. 必要に応じて `gas-rollback.yaml` ワークフローを `workflow_dispatch` で起動し、任意のコミットに切り戻します。
5. Slack 上でボットの動作を確認し、フィードバックに応じて改善します。

## GitHub Actions のセットアップ

自動デプロイ/切り戻しを有効にするには以下の Secrets をリポジトリに追加してください。

| Secret 名 | 説明 |
| --- | --- |
| `CLASP_CLIENT_ID` | Google Cloud OAuth クライアント ID |
| `CLASP_CLIENT_SECRET` | Google Cloud OAuth クライアント シークレット |
| `CLASP_REFRESH_TOKEN` | clasp で取得したリフレッシュトークン |
| `GAS_SCRIPT_ID` | 対象 Apps Script プロジェクトの Script ID |
| `GAS_DEPLOYMENT_ID` | 更新したい本番デプロイの Deployment ID（`clasp deployments` で確認可能） |

`gasdeploy.yaml` ワークフローは以下のイベントで動作します。

- メインブランチへの push
- Pull Request Review での承認 (`Approve`)
- 手動実行 (`workflow_dispatch`)

ワークフローは `HealthCheck.gs` の `healthCheck` 関数を実行し、結果をジョブサマリに表示します。エラーが発生した場合はジョブが失敗し、Apps Script 側の更新がロールバック対象であることを確認できます。

切り戻しが必要な場合は、`gas-rollback.yaml` を手動実行し、復元したいコミット SHA（またはブランチ/タグ）を `ref` に指定してください。実行すると指定したバージョンが Apps Script に push され、新しいバージョン番号でデプロイされます。

## 次のステップ

- `.github/workflows/gasdeploy.yaml` にデプロイ手順を記述
- Slack ボタン操作時に詳細入力モーダルを表示
- Notion データベースとの双方向同期
- 自動テスト/監視の整備

詳細なシステム要件やロードマップについては [`docs/system-overview.md`](docs/system-overview.md) を参照してください。
