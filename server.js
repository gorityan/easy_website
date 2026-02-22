/**
 * Website Generator Server
 * 動的にHTMLサイトを生成してダウンロード提供するExpress サーバー
 */

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// ============================================================
// ミドルウェア設定
// ============================================================
app.use(express.json({ limit: '1mb' }));
app.use(express.static('public'));

// ============================================================
// ユーティリティ関数：XSS対策用HTMLエスケープ
// ============================================================
function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ============================================================
// テーマカラーの定義
// ============================================================
const themeColors = {
  red: {
    primary: '#e74c3c',
    accent: '#c0392b',
    background: '#fff5f5',
    text: '#2c3e50'
  },
  blue: {
    primary: '#3498db',
    accent: '#2980b9',
    background: '#f0f8ff',
    text: '#1a1a2e'
  },
  green: {
    primary: '#27ae60',
    accent: '#229954',
    background: '#f0fdf4',
    text: '#1b4332'
  }
};

// ============================================================
// HTMLジェネレーター関数
// ============================================================
function generateWebsite(config) {
  // 入力値のバリデーション
  if (!config.siteTitle || !config.themeColor || !config.mainHeading || !config.layout) {
    throw new Error('Invalid configuration: missing required fields');
  }

  // テーマカラーの検証
  if (!themeColors[config.themeColor]) {
    throw new Error('Invalid theme color');
  }

  // レイアウトの検証
  if (!['layoutA', 'layoutB'].includes(config.layout)) {
    throw new Error('Invalid layout');
  }

  // エスケープ処理（XSS対策）
  const escapedTitle = escapeHtml(config.siteTitle);
  const escapedHeading = escapeHtml(config.mainHeading);

  // テーマカラーを取得
  const theme = themeColors[config.themeColor];

  // レイアウトに応じたHTMLを生成
  let contentLayout = '';

  if (config.layout === 'layoutA') {
    // レイアウトA：画像左・テキスト右
    contentLayout = `
      <div class="layout-a">
        <div class="layout-a__image">
          <div class="placeholder-image" style="background: linear-gradient(135deg, ${theme.accent}, ${theme.primary}); border-radius: 12px;">
            <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
              <rect width="400" height="300" fill="none"/>
              <circle cx="200" cy="150" r="80" fill="rgba(255,255,255,0.2)"/>
              <path d="M 100 200 Q 200 100, 300 200" stroke="rgba(255,255,255,0.3)" stroke-width="3" fill="none"/>
            </svg>
          </div>
        </div>
        <div class="layout-a__content">
          <h2>${escapedHeading}</h2>
          <p>このサイトは動的ジェネレーターによって生成されました。あなたの設定に基づいて、カスタマイズされたレイアウトが適用されています。</p>
          <p>左側の画像エリアに任意の画像を配置することができます。柔軟性の高いデザインシステムをお楽しみください。</p>
          <button class="cta-button" style="background-color: ${theme.primary}; border-color: ${theme.accent};">詳細を見る</button>
        </div>
      </div>
    `;
  } else {
    // レイアウトB：テキスト上・画像下
    contentLayout = `
      <div class="layout-b">
        <div class="layout-b__content">
          <h2>${escapedHeading}</h2>
          <p>このサイトは動的ジェネレーターによって生成されました。あなたの設定に基づいて、カスタマイズされたレイアウトが適用されています。</p>
          <p>下側の画像エリアを活用して、視覚的に魅力的なコンテンツ配置を実現できます。モバイル対応なレスポンシブデザインです。</p>
          <button class="cta-button" style="background-color: ${theme.primary}; border-color: ${theme.accent};">詳細を見る</button>
        </div>
        <div class="layout-b__image">
          <div class="placeholder-image" style="background: linear-gradient(135deg, ${theme.accent}, ${theme.primary}); border-radius: 12px;">
            <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
              <rect width="400" height="300" fill="none"/>
              <circle cx="200" cy="150" r="80" fill="rgba(255,255,255,0.2)"/>
              <path d="M 100 200 Q 200 100, 300 200" stroke="rgba(255,255,255,0.3)" stroke-width="3" fill="none"/>
            </svg>
          </div>
        </div>
      </div>
    `;
  }

  // 完全なHTMLドキュメントを生成
  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapedTitle}</title>
  <style>
    /* ============================================================
       リセットとベーススタイル
       ============================================================ */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html {
      scroll-behavior: smooth;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: ${theme.text};
      background-color: ${theme.background};
      transition: background-color 0.3s ease;
    }

    /* ============================================================
       ヘッダーセクション
       ============================================================ */
    .header {
      background: linear-gradient(135deg, ${theme.primary}, ${theme.accent});
      color: white;
      padding: 60px 20px;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      animation: slideDown 0.6s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .header h1 {
      font-size: 3.5rem;
      font-weight: 700;
      margin-bottom: 15px;
      letter-spacing: -1px;
    }

    .header p {
      font-size: 1.2rem;
      opacity: 0.95;
      max-width: 600px;
      margin: 0 auto;
    }

    /* ============================================================
       メインコンテンツエリア
       ============================================================ */
    .main-content {
      max-width: 1200px;
      margin: 80px auto;
      padding: 0 20px;
    }

    /* レイアウトA：画像左・テキスト右 */
    .layout-a {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      align-items: center;
      animation: fadeInUp 0.8s ease-out 0.2s both;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .layout-a__image {
      position: relative;
    }

    .layout-a__content h2 {
      font-size: 2.2rem;
      margin-bottom: 20px;
      color: ${theme.primary};
      font-weight: 700;
    }

    .layout-a__content p {
      font-size: 1.05rem;
      margin-bottom: 20px;
      line-height: 1.8;
      color: ${theme.text};
    }

    /* レイアウトB：テキスト上・画像下 */
    .layout-b {
      display: grid;
      grid-template-columns: 1fr;
      gap: 40px;
      animation: fadeInUp 0.8s ease-out 0.2s both;
    }

    .layout-b__content h2 {
      font-size: 2.2rem;
      margin-bottom: 20px;
      color: ${theme.primary};
      font-weight: 700;
    }

    .layout-b__content p {
      font-size: 1.05rem;
      margin-bottom: 20px;
      line-height: 1.8;
      color: ${theme.text};
    }

    /* ============================================================
       画像プレースホルダー
       ============================================================ */
    .placeholder-image {
      width: 100%;
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
      transition: transform 0.3s ease;
    }

    .placeholder-image:hover {
      transform: scale(1.02);
    }

    .placeholder-image svg {
      width: 80%;
      height: 80%;
      opacity: 0.6;
    }

    /* ============================================================
       ボタンスタイル
       ============================================================ */
    .cta-button {
      display: inline-block;
      padding: 14px 40px;
      font-size: 1rem;
      font-weight: 600;
      border: 2px solid;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      background-color: ${theme.primary};
      color: white;
      border-color: ${theme.accent};
    }

    .cta-button:hover {
      background-color: ${theme.accent};
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }

    .cta-button:active {
      transform: translateY(0);
    }

    /* ============================================================
       フッターセクション
       ============================================================ */
    .footer {
      background-color: ${theme.text};
      color: white;
      text-align: center;
      padding: 40px 20px;
      margin-top: 100px;
    }

    .footer p {
      opacity: 0.8;
      font-size: 0.95rem;
    }

    /* ============================================================
       レスポンシブデザイン
       ============================================================ */
    @media (max-width: 768px) {
      .header h1 {
        font-size: 2.5rem;
      }

      .header p {
        font-size: 1rem;
      }

      .layout-a {
        grid-template-columns: 1fr;
        gap: 40px;
      }

      .layout-a__content h2,
      .layout-b__content h2 {
        font-size: 1.8rem;
      }

      .layout-a__content p,
      .layout-b__content p {
        font-size: 1rem;
      }

      .main-content {
        margin: 50px auto;
      }
    }

    @media (max-width: 480px) {
      body {
        font-size: 14px;
      }

      .header {
        padding: 40px 15px;
      }

      .header h1 {
        font-size: 1.8rem;
      }

      .main-content {
        padding: 0 15px;
      }
    }
  </style>
</head>
<body>
  <header class="header">
    <h1>${escapedTitle}</h1>
    <p>このサイトは動的ジェネレーターで生成されたWebサイトです</p>
  </header>

  <main class="main-content">
    ${contentLayout}
  </main>

  <footer class="footer">
    <p>&copy; 2024 Dynamic Website Generator. Generated with ❤️</p>
  </footer>
</body>
</html>
`;

  return html;
}

// ============================================================
// ルート：メインページの提供
// ============================================================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ============================================================
// REST API：サイト生成エンドポイント
// ============================================================
app.post('/api/generate', (req, res) => {
  try {
    const { siteTitle, themeColor, mainHeading, layout } = req.body;

    // リクエストボディの検証
    if (!siteTitle || !themeColor || !mainHeading || !layout) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: siteTitle, themeColor, mainHeading, layout'
      });
    }

    // 設定オブジェクトを作成
    const config = {
      siteTitle,
      themeColor,
      mainHeading,
      layout
    };

    // HTMLを生成
    const html = generateWebsite(config);

    // ファイル名のエスケープ（ホスト側での使用）
    const sanitizedTitle = siteTitle.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 50);
    const filename = `generated-website-${sanitizedTitle}-${Date.now()}.html`;

    // HTMLをレスポンスで返す
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(html);

  } catch (error) {
    console.error('Error generating website:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate website',
      error: error.message
    });
  }
});

// ============================================================
// エラーハンドリング
// ============================================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Not Found'
  });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: err.message
  });
});

// ============================================================
// サーバー起動
// ============================================================
app.listen(PORT, () => {
  console.log(`\n✅ Website Generator Server is running!`);
  console.log(`📍 Access the application at: http://localhost:${PORT}`);
  console.log(`\n🚀 Ready to generate dynamic websites...\n`);
});
