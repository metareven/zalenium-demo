const webdriverio = require('webdriverio')
const { expect } = require('chai')

function logIn(browser){
    browser.url('https://kurator-back-office-feature-2480.kubeint.nrk.no/login')
    //Workaround for bug i forefox for CSS med ID-selector blir omgjort til feil type internt
    //Har laget issue hos webdriver.io og de har lovet å fikse det forholdsvis snart
    browser.setValue('body #username_input',`n${Math.floor(Math.random()*10000)}\uE007`)
}

function createNewHouse(browser){
    browser.click('[data-automation="house-settings:"]')
    browser.click('[data-automation="add-new-house:"]')
}

describe("test saving state", function() {
    const roomKicker = "Kicker"
    const artworkUrl = "https://gfx-stage.nrk.no/L6qb03_FVBFgi2cLP88yYgxyjWQ9V2wbhcnEZqHrrrfA"
    
    it("Saves a state to cache when making a room", function(){
	browser.timeouts('script',10000);
	browser.timeouts('implicit', 5000);
	logIn(browser)
	createNewHouse(browser)
	browser.click('#addFloor')
	browser.setValue(body '#room_kicker',roomKicker)
	browser.setValue('body #room_artwork_source', `${artworkUrl}\uE007`)
	const roomID = browser.getAttribute('.house-builder__room--selected', 'room-id')
	console.log("RoomID is: ",roomID)
	browser.pause(100) //Linja under krasjer hvis jeg ikke venter litt. Er det noe special special med cache APIet?
	const state = browser.executeAsync(
	    async function(done) {
		const caches = window.caches;
		const cache = await caches.open('kurator::preview');
		const response = await cache.match('api/preview');
		const state = await response.json();
		done(state);
	    }
	)
	const { artwork, kicker } = state.value.entities.rooms[`${roomID}`]
	expect(kicker).to.equal(roomKicker)
	expect(artwork.source).to.equal(artworkUrl)
	
    })
})
