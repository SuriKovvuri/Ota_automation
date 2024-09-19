test('Expect to pass', async() => {
	await page.goto("https://google.com")
});

test('Expect to fail', () => {
	expect(2 + 2).toBe(4);
});