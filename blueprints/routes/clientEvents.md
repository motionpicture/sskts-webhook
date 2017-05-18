# Group アプリケーションクライアントイベント

## ClientEvents [/clientEvents]

### クライアントイベント通知 [POST]

+ Request (application/json)
    + Attributes
        + client: `motionpicture` (string, required) - クライアントID
        + occurred_at: `2017-05-18T09:04:58.108Z` (string, required) - 発生日時(ISO 8601 format)
        + label: `sskts-webhook-test-label` (string, required) - ラベル
        + url: `https://example.com/path` (string, optional) - URL
        + category: `カテゴリー` (string, optional) - カテゴリー(使用方法はクライアント次第)
        + action: `アクション` (string, optional) - アクション(使用方法はクライアント次第)
        + message: `メッセージ` (string, optional) - メッセージ(使用方法はクライアント次第)
        + notes: `備考` (string, optional) - 備考(使用方法はクライアント次第)
        + useragent: `Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36` (string, optional) - ユーザーエージェント
        + location (array, optional, fixed_type) - ユーザー位置情報
            + `35.63588652257869` (number, required) - 緯度
            + `139.65534000898916` (number, required) - 経度
        + transaction: `591d689bbd490f1ed4f43077` (string, optional) - 取引ID

+ Response 201 (application/json)
    + Attributes
        + data
            + type: `client_events` (string, required) - リソースタイプ
            + id: `5868e16789cc75249cdbfa4b` (string, required) - イベントID

<!-- include(../response/400.md) -->
