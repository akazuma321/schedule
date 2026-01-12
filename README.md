# かずま - 予定調整ツール

予定調整と予約管理ができるシンプルなWebアプリケーションです。

## 機能

- 📅 カレンダー表示で予約管理
- 👥 グループ/1on1の予約タイプ選択
- 📋 予約一覧ページで全予約を確認
- 💾 ローカルストレージでデータ保存

## デプロイ方法

### Vercelでデプロイ（推奨）

1. **GitHubにリポジトリを作成**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/schedule-booking.git
   git push -u origin main
   ```

2. **Vercelでデプロイ**
   - [Vercel](https://vercel.com)にアクセス
   - GitHubアカウントでログイン
   - "New Project"をクリック
   - リポジトリを選択
   - "Deploy"をクリック

3. **完了！**
   - 自動的にURLが生成されます（例: `https://schedule-booking.vercel.app`）

### その他のデプロイ方法

#### Netlify
1. [Netlify](https://www.netlify.com)にアクセス
2. GitHubリポジトリを連携
3. ビルドコマンドは不要（静的サイト）
4. デプロイ

#### GitHub Pages
1. リポジトリのSettings > Pages
2. Sourceを"main"ブランチに設定
3. 保存

## ローカル開発

```bash
# ローカルサーバーを起動
python3 -m http.server 8000

# ブラウザで開く
open http://localhost:8000
```

## ファイル構成

- `index.html` - カレンダーページ
- `list.html` - 予約一覧ページ
- `app.js` - カレンダー機能のJavaScript
- `list.js` - 予約一覧機能のJavaScript
- `style.css` - スタイルシート
- `vercel.json` - Vercel設定ファイル

## カスタマイズ

利用可能な日時は `app.js` の `getAvailableTimeSlots` 関数で設定できます。

```javascript
function getAvailableTimeSlots(dateKey) {
    const availableDates = ['2026-01-14', '2026-01-18', '2026-01-20', '2026-01-27'];
    if (availableDates.includes(dateKey)) {
        return ['12時', '13時'];
    }
    return [];
}
```