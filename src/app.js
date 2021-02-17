const chromium = require("chrome-aws-lambda");

exports.lambdaHandler = async (event, context) => {
    const url = event.queryStringParameters.url
    console.info("url", url)

    let browser = null
    try {
        browser = await chromium.puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        })

        const page = await browser.newPage();
        await page.goto(url)
        const buffer = await page.pdf()

        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "*/*",
                "Content-Disposition": "attachment; filename=\"output.pdf\""
            },
            "body": buffer.toString("base64"),
            "isBase64Encoded": true,
        }
    } catch (err) {
        console.log(err);
        return err;
    } finally {
        if (browser !== null) {
            await browser.close();
        }
    }
};
