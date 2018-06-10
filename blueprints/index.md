FORMAT: 1A
HOST: https://example.com

# シネマサンシャインチケットシステム Webhook API Documentation

シネマサンシャインチケットシステムが提供するwebhookは、外部アプリケーションからのイベント通知を可能にするウェブアプリケーションです。

基本仕様は以下に従っています。

[JSON API](http://jsonapi.org/)

## 共通仕様

### ステータスコード

| status code | description                                    |
|-------------|------------------------------------------------|
| 200 OK      | リクエスト成功                                        |
| 400  OK     | リクエストに問題があります。リクエストパラメータやJSONのフォーマットを確認してください。 |
| 401  OK     | Authorizationヘッダを正しく送信していることを確認してください。         |
| 403  OK     | APIの利用権限がありません。スコープを確認してください。                  |
| 500  OK     | APIサーバ側の一時的なエラーです。                             |

### Error response

エラー時のresponse bodyは、以下のフィールドを持つJSONデータです。

| field                     | type   | description       |
|---------------------------|--------|-------------------|
| errors                    | Array  | エラーリスト            |
| errors[].source           | Object | エラーの発生箇所          |
| errors[].source.parameter | String | 問題のあるリクエストパラメータ名称 |
| errors[].title            | String | エラーの概要            |
| errors[].detail           | String | 詳細なエラー内容          |

あるいは

| field           | type   | description |
|-----------------|--------|-------------|
| errors          | Array  | エラーリスト      |
| errors[].title  | String | エラーの概要      |
| errors[].detail | String | 詳細なエラー内容    |

<!-- include(routes/404.md) -->
