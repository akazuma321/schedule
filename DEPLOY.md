# デプロイ手順

この予定調整ツールを万人がアクセスできるようにするための手順です。

## 方法1: Vercelでデプロイ（最も簡単・推奨）

### ステップ1: GitHubにリポジトリを作成

1. ターミナルで以下のコマンドを実行：

```bash
cd /Users/ak/schedule-booking

# Gitリポジトリを初期化
git init

# ファイルを追加
git add .

# コミット
git commit -m "Initial commit: 予定調整ツール"

# GitHubで新しいリポジトリを作成（ブラウザで）
# https://github.com/new にアクセス
# リポジトリ名を入力（例: schedule-booking）
# "Create repository"をクリック

# リモートリポジトリを追加（YOUR_USERNAMEを自分のユーザー名に置き換え）
git remote add origin https://github.com/YOUR_USERNAME/schedule-booking.git

# メインブランチを設定
git branch -M main

# プッシュ
git push -u origin main
```

### ステップ2: Vercelでデプロイ

1. [Vercel](https://vercel.com)にアクセス
2. "Sign Up"をクリックしてGitHubアカウントでログイン
3. ダッシュボードで"Add New..." > "Project"をクリック
4. 先ほど作成したリポジトリ（schedule-booking）を選択
5. プロジェクト設定：
   - Framework Preset: "Other"
   - Root Directory: `./`（そのまま）
   - Build Command: （空欄のまま）
   - Output Directory: （空欄のまま）
6. "Deploy"をクリック
7. 数秒でデプロイが完了し、URLが表示されます（例: `https://schedule-booking.vercel.app`）

### 完了！

これで世界中の誰でもアクセスできるようになりました。

---

## 方法2: Netlifyでデプロイ

1. [Netlify](https://www.netlify.com)にアクセス
2. GitHubアカウントでログイン
3. "Add new site" > "Import an existing project"
4. GitHubリポジトリを選択
5. ビルド設定：
   - Build command: （空欄）
   - Publish directory: （空欄）
6. "Deploy site"をクリック

---

## 方法3: GitHub Pagesでデプロイ

1. GitHubリポジトリのページで"Settings"をクリック
2. 左メニューから"Pages"を選択
3. Sourceで"Deploy from a branch"を選択
4. Branchで"main"を選択
5. Folderで"/ (root)"を選択
6. "Save"をクリック
7. 数分後に `https://YOUR_USERNAME.github.io/schedule-booking/` でアクセス可能

---

## カスタムドメインの設定（オプション）

VercelやNetlifyでは、独自ドメインを設定できます：

1. デプロイ後、プロジェクト設定で"Domains"を開く
2. ドメイン名を入力
3. DNS設定を指示に従って変更

---

## トラブルシューティング

### デプロイが失敗する場合

- `vercel.json`ファイルが正しく配置されているか確認
- すべてのファイルがGitに追加されているか確認（`git status`で確認）

### ページが表示されない場合

- ブラウザのコンソールでエラーを確認
- Vercel/Netlifyのログを確認

---

## 注意事項

- ローカルストレージはブラウザごとに保存されるため、デバイス間でデータは共有されません
- 複数ユーザーで共有する場合は、バックエンドAPIの実装が必要です