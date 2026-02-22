# Website Generator MVP

ユーザーがブラウザ上のフォームから設定値を入力し、カスタマイズされたWebサイト（HTMLファイル）を動的に生成してダウンロードできるシステムです。

## 📋 プロジェクト構成

```
site-generator/
├── server.js              # Express サーバー（REST API実装）
├── package.json          # 依存パッケージ定義
├── public/
│   └── index.html        # フロントエンド（設定フォーム）
└── README.md             # このファイル
```

## 🎯 機能仕様

### フロントエンド
- **サイトタイトル**: テキスト入力（必須）
- **テーマカラー**: セレクトボックス（Red, Blue, Green）
- **メイン見出し**: テキスト入力（必須）
- **レイアウト構成**: ラジオボタン
  - レイアウトA: 画像左・テキスト右
  - レイアウトB: テキスト上・画像下

### バックエンド REST API
- **エンドポイント**: `POST /api/generate`
- **リクエスト形式**: JSON
- **レスポンス**: HTMLファイルをダウンロード
- **セキュリティ**: XSS対策としてユーザー入力をHTMLエスケープ処理

## 🔒 セキュリティ機能

### XSS（クロスサイトスクリプティング）対策
バックエンド（server.js）で実装される`escapeHtml()`関数により、ユーザーが入力したテキストは以下の文字をエスケープされます：
- `&` → `&amp;`
- `<` → `&lt;`
- `>` → `&gt;`
- `"` → `&quot;`
- `'` → `&#039;`

これにより、HTML特殊文字が含まれたタイトルや見出しでも安全に処理されます。

## 💻 セットアップ手順

### 1. 前提条件
- **Node.js** v14.0.0 以上がインストールされていることを確認

```bash
node --version
npm --version
```

### 2. プロジェクトディレクトリへ移動

```bash
cd site-generator
```

### 3. 依存パッケージをインストール

```bash
npm install
```

このコマンドで以下がインストールされます：
- **express** (v4.18.2) - Webフレームワーク

### 4. サーバーを起動

```bash
npm start
```

または

```bash
node server.js
```

実行例：
```
✅ Website Generator Server is running!
📍 Access the application at: http://localhost:3000

🚀 Ready to generate dynamic websites...
```

## 🌐 使用方法

### ブラウザでのアクセス

1. サーバー起動後、ブラウザを開いて以下のURLにアクセス：
   ```
   http://localhost:3000
   ```

2. フォーム画面が表示されます：
   - **サイトタイトル**: 任意のテキストを入力（例：「My Awesome Website」）
   - **テーマカラー**: ドロップダウンから選択（Red, Blue, Green）
   - **メイン見出し**: 任意のテキストを入力（例：「Welcome to My Site」）
   - **レイアウト構成**: ラジオボタンから選択

3. 「サイトを生成してダウンロード」ボタンをクリック

4. HTMLファイルが自動的にダウンロードされます

5. ダウンロードされたHTMLファイルをブラウザで開くと、生成されたWebサイトが表示されます

## 📡 REST API 仕様

### リクエスト例

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "siteTitle": "My Website",
    "themeColor": "blue",
    "mainHeading": "Welcome!",
    "layout": "layoutA"
  }'
```

### リクエストボディ

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| siteTitle | string | ✓ | Webサイトのタイトル |
| themeColor | string | ✓ | テーマカラー（red, blue, green） |
| mainHeading | string | ✓ | メイン見出しテキスト |
| layout | string | ✓ | レイアウト（layoutA, layoutB） |

### レスポンス

成功時（200）：
- Content-Type: `text/html; charset=utf-8`
- Content-Disposition: `attachment; filename="generated-website-...html"`
- レスポンスボディ：生成されたHTML文字列

エラー時（400, 500）：
```json
{
  "success": false,
  "message": "エラーメッセージ",
  "error": "詳細情報"
}
```

## 🎨 生成されるHTMLサイトの特徴

生成されたWebサイトには以下の機能が含まれます：

- **レスポンシブデザイン**: モバイル・タブレット・デスクトップ対応
- **アニメーション**: 画面ロード時のフェードイン効果
- **テーマカラー**: 選択したカラーがヘッダーとアクセントに反映
- **デバイス対応**: 各レイアウトは自動的にモバイル表示に最適化
- **アクセシビリティ**: 標準的なHTML5とCSS対応

### レイアウトA（画像左・テキスト右）

デスクトップ表示で：
- 左側：グラデーション背景の画像プレースホルダー
- 右側：テキストコンテンツとCTAボタン

モバイル表示で：
- 上から順に積み重ねられた構成に自動変更

### レイアウトB（テキスト上・画像下）

- 上部：テキストコンテンツとCTAボタン
- 下部：グラデーション背景の画像プレースホルダー
- モバイル表示でも同じスタック構成を維持

## 🧪 動作確認

### 正常動作の確認手順

1. **サーバー起動確認**
   ```bash
   npm start
   ```
   出力に「Website Generator Server is running!」が表示されることを確認

2. **ブラウザアクセス確認**
   - `http://localhost:3000` にアクセス
   - フォーム画面が表示されることを確認

3. **サイト生成確認**
   - フォームに以下の値を入力：
     - サイトタイトル: `Test Website`
     - テーマカラー: `Blue`
     - メイン見出し: `Hello World`
     - レイアウト: `layoutA`
   - 「サイトを生成してダウンロード」をクリック
   - HTMLファイルがダウンロードされることを確認

4. **生成ファイル確認**
   - ダウンロードされたHTMLファイルをブラウザで開く
   - 以下が確認できることを確認：
     - ページタイトルが「Test Website」
     - ヘッダーのタイトルが「Test Website」
     - メイン見出しが「Hello World」
     - テーマカラーがブルーで統一
     - レイアウトAが適用（画像左・テキスト右）

### XSS対策の確認

1. 以下の悪意のあるテキストを入力：
   - サイトタイトル: `<script>alert('XSS')</script>`
   - メイン見出し: `<img src=x onerror=alert('XSS')>`

2. サイトを生成してダウンロード

3. ダウンロードされたHTMLファイルをテキストエディタで開く

4. HTMLタグがエスケープされていることを確認：
   - `<` が `&lt;` に変換
   - `>` が `&gt;` に変換
   - これにより、スクリプトが実行されず、テキストとして表示される

## 📊 技術スタック

| レイヤー | 技術 |
|---------|------|
| フロントエンド | HTML5, CSS3, JavaScript（ES6） |
| バックエンド | Node.js, Express.js |
| 通信方式 | REST API (JSON) |
| セキュリティ | HTMLエスケープ処理 |

## 🚀 スケーリングの考慮事項

MVP版として現在の実装は以下に対応しています：

- **ステートレス設計**: サーバー側にファイルを保存しない
- **メモリ効率**: リアルタイム生成でメモリ消費を最小化
- **スケーラビリティ**: 負荷分散対応可能な設計

将来の拡張案：
- テンプレートの増加（複数のレイアウトパターン）
- ユーザーアカウント機能
- 生成履歴の管理
- 画像アップロード機能
- データベース統合

## 🐛 トラブルシューティング

### ポート3000が既に使用されている場合

```bash
# macOS/Linux
lsof -i :3000

# Windows
netstat -ano | findstr :3000

# ポートを変更する場合は、server.js の PORT 変数を編集
```

### npm install でエラーが出た場合

```bash
# npm キャッシュをクリア
npm cache clean --force

# 再度インストール
npm install
```

### ダウンロードされたファイルが開かない場合

- ファイルの拡張子が `.html` であることを確認
- ブラウザでファイルをドラッグ&ドロップして開く
- または右クリック→「プログラムから開く」でブラウザを選択

## 📝 ライセンス

MIT License

## 👨‍💻 開発者向け情報

### コード構造

**server.js** の主要関数：
- `escapeHtml()`: XSS対策用のエスケープ処理
- `generateWebsite()`: HTMLドキュメント生成ロジック
- POST `/api/generate`: REST APIエンドポイント

**public/index.html** の主要セクション：
- フォーム入力UI
- API通信ロジック
- ファイルダウンロード処理
- エラーハンドリング

### カスタマイズ例

#### 新しいテーマカラーを追加

server.js の `themeColors` オブジェクトに新しいカラースキームを追加：

```javascript
const themeColors = {
  red: { ... },
  blue: { ... },
  green: { ... },
  purple: {           // 新規追加
    primary: '#9b59b6',
    accent: '#8e44ad',
    background: '#f5f0ff',
    text: '#2c1a3f'
  }
};
```

public/index.html の セレクトボックスに選択肢を追加：

```html
<option value="purple">🟣 パープル</option>
```

#### レイアウトを増やす

server.js の `generateWebsite()` 関数に新しいレイアウト判定を追加：

```javascript
if (config.layout === 'layoutC') {
  // 新しいレイアウトのHTML
  contentLayout = `...`;
}
```

## 📧 サポート

質問やバグ報告については、プロジェクトのIssueを作成してください。

---

**Happy Site Generating! 🎉**
