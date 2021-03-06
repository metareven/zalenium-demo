const { Builder, By } = require('selenium-webdriver');

async function test(browsername = 'chrome') {

  let driver = await new Builder()
    .forBrowser(browsername)
    .usingServer(process.env.SELENIUM_SERVER || 'http://localhost:4444/wd/hub')
    .build();

  try {
    await driver.manage().setTimeouts({ implicit: 5000 });
    console.log("set timeout")
    await driver.get(process.env.URL ||'https://kurator-varnish-feature-2503.kubeint.nrk.no/');
    console.log("opened page")
    await driver.findElement(By.css(".kur-room"))
    console.log("Found kur-room")
    await driver.sleep(5000);
    console.log("sleep some here.. zzz")
    const rooms = await driver.findElements(By.css('.kur-room'))
    console.log("found rooms:", rooms.length)
    const randomRoom = rooms[Math.floor(Math.random() * rooms.length)]
    console.log("found random room", randomRoom)
    await randomRoom.click()
    console.log("clicked random room")
    await driver.sleep(5000)
    console.log("sleeping for a bit zzz")
  } catch (error) {
    console.error('Error:', error);
  } finally {
    console.log('Exiting webdriver');
    try{
        await driver.quit();
    } catch(e) {
      console.log("could not stop the driver!")
    }
    await test();
  }
}

test()
