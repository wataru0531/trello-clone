# My Trello Clone

Trello風のタスク管理アプリ。
ボード・リスト・カードの作成と並び替えが可能

## Features
- ボード管理
- リストの追加・削除
- カードの追加・並び替え（Drag & Drop）

## Tech Stack
- Frontend: React / TypeScript / Vite
- State: Jotai
- Backend: Node.js / Express
- DB: PostgreSQL / TypeORM

## Jotai
- React向けのシンプルな状態管理ライブラリ
- 状態を atom（原子）単位で管理する
- なぜJotaiを使うのか？
  - useState の限界
    - 親 → 子 → 孫… と propsバケツリレー
    - 離れたコンポーネントで状態共有がつらい
  - Reduxよりも圧倒的に軽量&簡単

