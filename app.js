const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;
const REDIRECT_DOMAIN = 'https://ynagaro.com';

app.use((req, res) => {
    const sessionStartTimeUsec = Date.now() * 1000;
    const fullPathWithQuery = req.originalUrl;
    const landingUrl = `${REDIRECT_DOMAIN}${fullPathWithQuery}`;

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

    console.log(JSON.stringify(logEntry));
    res.redirect(301, landingUrl);
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});
