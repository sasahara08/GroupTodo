了解です 👍（←これは最後の絵文字）
絵文字を除いたクリーンな `README.md` 版を以下に示します。
そのままコピーしてプロジェクト直下に `README.md` として保存できます。

---

# GroupTodo - Laravel + Vite + React Todo管理アプリ

![screenshot](public/images/screenshot.png)

## 概要

このアプリは、**Laravel（APIサーバー）** と **React（フロントエンド）** を組み合わせた
グループ向けのTodo管理システムです。

画像アップロードには **MinIO（S3互換ストレージ）** を使用しています。

---

## 主な機能

* Todoの登録・編集・削除（非同期通信）
* 期限付きTodo管理（DatePicker対応）
* 画像添付（MinIOにアップロード）
* グループ共有機能
* Sanctumによるログイン認証

---

## 環境構成

| 項目      | 内容              |
| ------- | --------------- |
| バックエンド  | Laravel 11      |
| フロントエンド | React + Vite    |
| ストレージ   | MinIO           |
| データベース  | MySQL           |
| セッション管理 | Database Driver |

---

## 環境変数設定例（`.env`）

```env
APP_URL=http://localhost
FRONT_URL=http://localhost:5173

SESSION_DRIVER=database
SESSION_DOMAIN=localhost
SANCTUM_STATEFUL_DOMAINS=localhost:5173

MINIO_ENDPOINT=http://localhost:9000
MINIO_KEY=minioadmin
MINIO_SECRET=minioadmin
MINIO_BUCKET=todo-bucket
```

---

## 起動方法

### バックエンド（Laravel）

```bash
composer install
php artisan migrate
php artisan serve
```

### フロントエンド（React）

```bash
npm install
npm run dev
```

---

## 画面イメージ

| Todo一覧                             | 登録モーダル                              |
| ---------------------------------- | ----------------------------------- |
| ![一覧](public/images/todo_list.png) | ![登録](public/images/todo_modal.png) |

---

## ディレクトリ構成

```
app/
├─ Http/Controllers/TodoController.php
├─ Models/Todo.php
resources/
├─ js/
│   ├─ components/
│   │   ├─ TodoList.jsx
│   │   ├─ TodoModal.jsx
│   │   └─ Dropzone.jsx
│   └─ pages/Home.jsx
public/
└─ images/
    ├─ screenshot.png
    ├─ todo_list.png
    └─ todo_modal.png
```

---

## 開発者

* 開発者: sasahara08
* リポジトリ: [https://github.com/sasahara08/GroupTodo](https://github.com/sasahara08/GroupTodo)

---
