/**
 * グローバルヘルパー
 *
 * @ignore
 */
before((done) => {
    // ベーシック認証設定を解除してからテスト開始
    delete process.env.SSKTS_WEBHOOK_BASIC_AUTH_NAME;
    delete process.env.SSKTS_WEBHOOK_BASIC_AUTH_PASS;

    done();
});
