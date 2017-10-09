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
``` shell
set NPM_TOKEN=**********npm認証トークン**********
set NODE_ENV=**********環境名**********
set MONGOLAB_URI=**********MongoDB接続URI**********
set GMO_ENDPOINT=**********GMOサービスエンドポイント**********
set COA_ENDPOINT=**********COAサービスエンドポイント**********
set COA_REFRESH_TOKEN=**********COAサービスリフレッシュトークン**********
```

only on Aure WebApps

``` shell
set WEBSITE_NODE_DEFAULT_VERSION=**********
```


# 参考
