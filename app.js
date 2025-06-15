const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;
const REDIRECT_DOMAIN = 'https://ynagaro.com';

app.use((req, res) => {
    
    const sessionStartTimeUsec = Date.now() * 1000;
    const fullPathWithQuery = req.originalUrl;
    const landingUrl = `${REDIRECT_DOMAIN}${fullPathWithQuery}`;

    // Cloud Loggingは、特定のJSON構造を解釈してリッチなログを生成する
    // https://cloud.google.com/logging/docs/structured-logging
    const logEntry = {
        severity: 'INFO',
        message: 'Redirecting request',
        sessionAttributes: {
            queryParams: req.query,
            landingUrl: landingUrl,
            sessionStartTimeUsec: sessionStartTimeUsec,
            refererUrl: req.get('Referer'),
            userAgent: req.get('User-Agent'),
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
