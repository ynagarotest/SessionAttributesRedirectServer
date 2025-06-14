const express = require('express');
const app = express();

// 環境変数からポート番号を取得。なければ8080をデフォルトにする。
const PORT = process.env.PORT || 8080;

// リダイレクト先のドメイン
const REDIRECT_DOMAIN = 'https://ynaggaro.com';

// 全てのパスとメソッド(*)に対応するミドルウェア
app.use((req, res) => {
    // リクエストされたパスとクエリパラメータを取得
    // req.originalUrl は /path?query=value のような形式
    const fullPathWithQuery = req.originalUrl;

    // リダイレクト先の完全なURLを生成
    // 例: https://ynaggaro.com/items/123?a=b
    const destinationUrl = `${REDIRECT_DOMAIN}${fullPathWithQuery}`;

    // Cloud Loggingは、特定のJSON構造を解釈してリッチなログを生成する
    // https://cloud.google.com/logging/docs/structured-logging
    const logEntry = {
        severity: 'INFO',
        message: 'Redirecting request',
        httpRequest: {
            requestMethod: req.method,
            requestUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
            userAgent: req.get('User-Agent'),
            referer: req.get('Referer'),
        },
        redirectInfo: {
            sourceHost: req.hostname,
            destinationUrl: destinationUrl,
            queryParams: req.query,
        }
    };

    // JSON形式で標準出力する (これがCloud Loggingに記録される)
    console.log(JSON.stringify(logEntry));

    // 301 (Moved Permanently) リダイレクトを実行
    res.redirect(301, destinationUrl);
});

// サーバーを起動
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});