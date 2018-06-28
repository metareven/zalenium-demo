const {Builder, By, Key, until} = require('selenium-webdriver');
let driver = null;

process.on('SIGINT', () => {
    console.log('Received SIGINT.');
    driver.quit()
	.then(()=>{
	    process.exit(1)
	})
	.catch(()=>{
	    process.exit(1)
	})
});


async function runTest(browsername, url){
    const start = new Date()
    driver = await new Builder()
	.withCapabilities({
	    "browserstack.local": "true"
	})
	.forBrowser(browsername)
	.usingServer('http://localhost:4444/wd/hub')
	.build();
    try{
	await driver.manage().setTimeouts({implicit:10000})
	await driver.manage().setTimeouts({script:10000})
	await driver.get(url)
	await test(driver)
	console.log("complete!", new Date() - start, "ms spent")
	await driver.quit()
    } catch(error) {
	console.error(error)
	await driver.sleep(1000 * 30 * 60)
    }
}

async function test(driver){
    await driver.findElement(By.css('.herpaderp'))
}


runTest('chrome','https://www.google.com')
