
// ✅ typeorm
// → JavaScript / TypeScript でデータベースを簡単に扱うためのライブラリ（ORM）
//    普通にDBを扱うとSQL文を書く必要があるがSQL文を書かなくてもいい。


// ✅ DataSource
// → データベースとの接続設定＋管理オブジェクト
// ... データベースへの接続方法・ルールを書いた設計図

// 
// Entity	「今あるべきDB構造の設計図」。DBの設計図。履歴は持たない。
// Migration	「DB構造をどう変えてきたかの履歴」
// Database(DB)	「実際にデータが入っている本体」

import { DataSource } from 'typeorm';


export default new DataSource({ // → DB接続の設計図を作っている
  migrationsTableName: 'migrations', // DBの変更履歴を管理するためのもの
  type: 'sqlite', // 使用するDBの種類。mysql、mariadb、postgresなども選択可能
                  // sqliteのDBはファイルとして出力される
  database: './data/trello-clone.sqlite', // SQLiteの DBファイルの場所
  synchronize: false, // 自動でテーブルを変更しない。マイグレーションでのみ変更（安全）
  migrationsRun: true, // 起動時にマイグレーションを自動実行
  logging: ['query', 'error', 'log'], // コンソールに出すログの種類。実行されたSQLが見える
  entities: [process.env.DB_TYPEORM_ENTITIES || 'src/**/*.entity.ts'], // DBのテーブル定義。「このファイル群をテーブルとして使いますよ」という指定
  migrations: [process.env.DB_TYPEORM_MIGRATIONS || 'src/migration/**/*.ts'], // マイグレーションファイルの場所。DB構造の変更履歴
  subscribers: [process.env.DB_TYPEORM_SUBSCRIBERS || 'src/subscriber/**/*.ts'], // DBイベント（insert / update など）を監視する仕組み
});
