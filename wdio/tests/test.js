const webdriverio = require('webdriverio')

describe("test", function() {
    it("tests", function(){
	browser.url('http://kurator-back-office-stage.nrk.no')
	browser.setValue('#username_input','n635412\uE007')
	browser.click('.house-selector__house-name[data-house-id="143915"]')
	browser.click('#previewHouse')
	const handles = browser.windowHandles()
	console.log(handles)
    })
})
