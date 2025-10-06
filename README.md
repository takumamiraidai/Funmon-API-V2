# FunMon API v2.0

公立はこだて未来大学の教員情報管理APIです。Honoフレームワークを使用してリファクタリングされています。

## 🚀 特徴

- **Honoフレームワーク**: 高速で軽量なWebフレームワーク
- **型安全性**: TypeScriptによる完全な型定義
- **バリデーション**: Zodを使用した堅牢なデータ検証
- **レイヤードアーキテクチャ**: Controller → Service → Database の明確な責任分離
- **エラーハンドリング**: 統一されたエラー処理
- **CORS対応**: 適切なCORS設定
- **ロギング**: リクエスト/レスポンスのロギング

## 📁 プロジェクト構造

```
src/
├── index.ts                      # アプリケーションエントリーポイント
├── types/                        # 型定義
│   ├── env.ts                   # 環境変数の型
│   ├── funmon.ts                # FunMon関連の型
│   └── user.ts                  # User関連の型
├── validators/                   # バリデーションスキーマ
│   ├── funmon.validator.ts      # FunMonバリデーション
│   └── user.validator.ts        # Userバリデーション
├── middlewares/                  # ミドルウェア
│   ├── cors.middleware.ts       # CORS設定
│   ├── error.middleware.ts      # エラーハンドリング
│   └── logger.middleware.ts     # ロギング
├── services/                     # ビジネスロジック
│   ├── funmon.service.ts        # FunMonサービス
│   ├── user.service.ts          # Userサービス
│   ├── gpt.service.ts           # GPTサービス
│   └── image.service.ts         # 画像サービス
├── controllers/                  # リクエストハンドラー
│   ├── funmon.controller.ts     # FunMonコントローラー
│   ├── user.controller.ts       # Userコントローラー
│   ├── gpt.controller.ts        # GPTコントローラー
│   └── image.controller.ts      # 画像コントローラー
├── routes/                       # ルーティング
│   ├── funmon.routes.ts         # FunMonルート
│   ├── user.routes.ts           # Userルート
│   ├── gpt.routes.ts            # GPTルート
│   └── image.routes.ts          # 画像ルート
├── database/                     # レガシーデータベース層(非推奨)
├── gpt/                         # レガシーGPT層(非推奨)
└── pics/                        # レガシー画像層(非推奨)
```

## 🛠️ セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# デプロイ
npm run deploy

# テストの実行
npm test
```

## 📡 API エンドポイント

### FunMon (教員情報)

- `GET /api/get_all_funmon` - 全教員情報を取得
- `GET /api/get_funmon_by_id?id={id}` - IDで教員情報を取得
- `POST /api/get_funmon_by_name_list` - 名前リストで教員情報を取得
- `POST /api/write_funmon` - 教員情報を作成/更新

### User (ユーザー情報)

- `GET /api/get_user_by_id?id={id}` - IDでユーザー情報を取得
- `POST /api/write_user` - ユーザー情報を作成/更新

### GPT (AI推薦)

- `GET /api/gpt?input={query}` - AI教員推薦を取得

### Image (画像管理)

- `POST /api/upload_pic` - 画像をアップロード
- `GET /api/load_pic?key={key}` - 画像を取得

## 🔧 環境変数

wrangler.toml で以下の環境変数を設定してください:

```toml
[vars]
R2_ACCESS_KEY_ID = "your-access-key"
R2_SECRET_ACCESS_KEY = "your-secret-key"
R2_BUCKET_NAME = "your-bucket-name"
R2_REGION = "auto"
R2_ACCOUNT_ID = "your-account-id"
API_KEY = "your-openai-api-key"
```

## 🏗️ アーキテクチャ

このAPIは以下のレイヤードアーキテクチャを採用しています:

1. **Routes**: エンドポイントの定義とルーティング
2. **Controllers**: リクエスト/レスポンスの処理とバリデーション
3. **Services**: ビジネスロジックの実装
4. **Database**: データアクセス層

各層は明確に責任が分離されており、テスタビリティと保守性が向上しています。

## 🔄 マイグレーション情報

### 変更点

1. **Honoフレームワークの導入**: 生のCloudflare WorkersからHonoベースに移行
2. **バリデーション追加**: Zodによる型安全なバリデーション
3. **レイヤード化**: Controller/Service/Repositoryパターンの導入
4. **エラーハンドリング改善**: 統一されたエラー処理
5. **型定義の整理**: 全ての型を専用ファイルに分離
6. **ミドルウェア化**: CORS、ログ、エラー処理をミドルウェア化

### 後方互換性

全てのAPIエンドポイントとレスポンス形式は元の実装と100%互換性があります。

### 非推奨ファイル

以下のファイルは新しいアーキテクチャでは使用されていませんが、参照用に残されています:

- `src/index.old.ts` (元のindex.ts)
- `src/database/**/*.ts` (新しいサービス層で置き換え)
- `src/gpt/**/*.ts` (新しいサービス層で置き換え)  
- `src/pics/**/*.ts` (新しいサービス層で置き換え)

## 📝 ライセンス

MIT
