// test suite
describe(`Google`,() => {
    //let page;
    const timeout = 5000;
    
    beforeAll(async () => {
        // before every test, open new tab and navigate to google. 
        //page = await global.__BROWSER__.newPage();
        await page.goto(`https://google.com`);
    }, timeout);

    // single test 
    test(`should load without error`, async () => {
        // get the HTML content from the page
        const text = await page.evaluate(() => document.body.textContent);
        
        // verify that the content contains the word `google`
        expect(text).toContain(`google`);
    });
});