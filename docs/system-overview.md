# 初期構築システム概要

このドキュメントは、GitHub と Slack/Notion を連携したタスク管理ボット群の初期構築方針をまとめたものです。以下のアーキテクチャは Google Apps Script (GAS) を中核とし、GitHub Actions による自動デプロイを前提としています。

## モジュール構成

| ファイル | 役割 |
| --- | --- |
| `src/EventRouter.gs` | Slack アプリからの HTTP リクエストを受け付け、対象ボットへルーティングします。 |
| `src/TaskDetectBot.gs` | Slack 投稿を解析してタスク候補を生成し、確認フローを提示します。 |
| `src/TaskCheckBot.gs` | 入力項目の検証と Notion への同期を担当します。 |
| `src/TaskBriefingBot.gs` | 日次レポートを作成し Slack へ投稿します。 |
| `src/Scheduler.gs` | レポート通知のためのトリガー設定を提供します。 |
| `src/SlackClient.gs` | Slack Web API 呼び出しをラップします。 |
| `src/NotionClient.gs` | Notion API を用いたタスク同期を行います。 |
| `src/Config.gs` | Apps Script プロパティから各種認証情報を読み込みます。 |

## デプロイフロー概要

1. メインブランチへ変更をプッシュ
2. GitHub Actions (`.github/workflows/gasdeploy.yaml`) が実行
3. Lint/テストフェーズ（今後導入）を通過
4. clasp などのデプロイツールで GAS プロジェクトへ反映
5. Slack へ結果通知

## 今後のタスク

- Notion データベーススキーマの確定
- Slack ボタン操作時の詳細入力モーダル実装
- GitHub Actions からの GAS デプロイ用トークン管理
- E2E テストの自動化
- Bot ごとの機能拡張と責務分離の強化
