describe("test saving state", function() {
    it("Saves a state to cache when making a room", function(){
	let roomId = null;
	const roomKicker = "Kicker"
	const artworkUrl = "https://gfx-stage.nrk.no/L6qb03_FVBFgi2cLP88yYgxyjWQ9V2wbhcnEZqHrrrfA"
	
	cy.visit('https://kurator-back-office-feature-2480.kubeint.nrk.no/login')
	cy.get('#username_input').type(`n${Math.floor(Math.random()*10000)}{enter}`)

	cy.get('[data-automation="house-settings:"]').click()
	cy.get('[data-automation="add-new-house:"]').click()
	
	cy.get('#addFloor').click()
	cy.get('#room_kicker').type(roomKicker)
	cy.get('#room_artwork_source').type(`${artworkUrl}{enter}`)
	//Ingen støtte for å hente ut verdier fra et element, bare å verifisere dem.
	//Må hacke det til med native javascript
	//Elementet ligger inne i en iframe og man må derfor først hente body til iframen
	cy.get('body').find('.house-builder__room--selected')
	    .then((result)=>{
		roomId = result.attr('room-id')
		console.log(roomId)
		//Ingen støtte for async await i cypress :(
		//Kan kanskje hackes til av noen med mer skillz enn Lars
		//Bruker standard promise chaining istedet
		const caches = window.caches;
		return caches.keys()
		    .then((keys)=> {
			return caches.open(keys[0])
		    })
		    .then((cache) => {
			return cache.keys().
			    then((keys) => {
				return {keys, cache}
			    })
		    })
		    .then((cacheObject) => {
			console.log(cacheObject)
			return cacheObject.cache.match(cacheObject.keys[0])
		    })
		    .then((response) => {
			console.log(response)
			return response.json()
		    })
		    .then((state) => {
			console.log("state",state)
			const { artwork, kicker } = state.entities.rooms[`${roomId}`]
			expect(kicker).to.equal(roomKicker)
			expect(artwork.source).to.equal(artworkUrl)
		    })
	    })	
    })
})
