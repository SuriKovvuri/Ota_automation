const measure = require(`./measure`).measure;

// this test measure opening metrics of a menu
test('should measure open widget action', async () => {
    
    // start track measure when the user click on menu button
    await measure(page, `openMenu`, async () => {
        // verify the button is visible on the page, and then click on it
        const button = await page.waitForSelector(`#menuButton`);
        await button.click();

        // wait until the menu is visible
        await page.waitForSelector(`#menu`, {visible: true});
  });
});