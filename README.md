<img src="https://motionpicture.jp/images/common/logo_01.svg" alt="motionpicture" title="motionpicture" align="right" height="56" width="98"/>

# sskts webhook ウェブアプリケーション

# Getting Started

## インフラ
基本的にnode.jsのウェブアプリケーション。
ウェブサーバーとしては、AzureのWebAppsあるいはGCPのAppEngineを想定。
両方で動くように開発していくことが望ましい。

## 言語
実態としては、linuxあるいはwindows上でのnode.js。
プログラミング言語としては、alternative javascriptのひとつであるTypeScript。

* TypeScript(https://www.typescriptlang.org/)

## 開発方法
npmでパッケージをインストール。
`npm install`

* npm(https://www.npmjs.com/)

typescriptをjavascriptにコンパイル。
`npm run build`


監視させる場合はこちら。
`npm run build -- -w`


npmでローカルサーバーを起動。
`npm start`

(http://localhost:8080)にアクセスすると、ローカルでウェブアプリを確認できます。

以下指定するとデバッグモード。
`set DEBUG=sskts-webhook:*`


### tslint

コード品質チェックをtslintで行う。
* [tslint](https://github.com/palantir/tslint)
* [tslint-microsoft-contrib](https://github.com/Microsoft/tslint-microsoft-contrib)

`npm run check`でチェック実行。



### Test

`npm test`でテストコード実行。


## パッケージ脆弱性のチェック

* [nsp](https://www.npmjs.com/package/nsp)


## ドキュメント
`npm run doc`でjsdocが作成されます。


## Required environment variables
```shell
set NPM_TOEN=**********
set NODE_ENV=**********
set MONGOLAB_URI=**********
set SENDGRID_API_KEY=**********
set GMO_ENDPOINT=**********
set COA_ENDPOINT=**********
set COA_REFRESH_TOKEN=**********
```

only on Aure WebApps

```shell
set WEBSITE_NODE_DEFAULT_VERSION=**********
```

ベーシック認証をかけたい場合

```shell
set SSKTS_WEBHOOK_BASIC_AUTH_NAME=**********認証ユーザー名**********
set SSKTS_WEBHOOK_BASIC_AUTH_PASS=**********認証パスワード**********
```


# 参考
