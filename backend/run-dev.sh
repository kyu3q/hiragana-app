#!/bin/bash

# 開発環境用の起動スクリプト
# .envファイルから環境変数を読み込んでSpring Bootを起動

# .envファイルが存在するか確認
if [ ! -f .env ]; then
    echo "❌ エラー: .envファイルが見つかりません"
    echo "📝 以下の手順で.envファイルを作成してください:"
    echo "   1. cp .env.example .env"
    echo "   2. .envファイルを編集して実際の値を入力"
    exit 1
fi

# .envファイルから環境変数を読み込む
echo "📧 .envファイルから環境変数を読み込んでいます..."
export $(cat .env | grep -v '^#' | xargs)

# 環境変数が設定されているか確認
if [ -z "$GMAIL_USERNAME" ] || [ -z "$GMAIL_APP_PASSWORD" ]; then
    echo "❌ エラー: GMAIL_USERNAMEまたはGMAIL_APP_PASSWORDが設定されていません"
    echo "📝 .envファイルを確認してください"
    exit 1
fi

echo "✅ 環境変数を読み込みました"
echo "📧 GMAIL_USERNAME: $GMAIL_USERNAME"
echo "🌐 FRONTEND_URL: $FRONTEND_URL"
echo ""
echo "🚀 Spring Bootを起動しています..."
echo ""

# Spring Bootを起動
./mvnw spring-boot:run
