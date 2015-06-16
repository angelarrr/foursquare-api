$(function() {
	// variables
	var clientID = "client_id=TTPLKKHFQ2EUV42M5SIJG2FJ30SQBMCWQSSJTVHU304KYTYW";
	var clientSecret = "client_secret=40AH4GO1MG21QIZ5PSBLASDPD501VRI25FZKSL4KMXKC5D5L";
	var versionParam = "v=20140806";
	var site = "https://api.foursquare.com/v2/venues/explore"

	
	// search type and location input event
	$('#input-search').submit(function(event){
		event.preventDefault();
		$('#search-results').html('');

		var searchType = $('#looking-for').val();
		var searchLoc = $('#location').val();
		getResults(searchType, searchLoc);
	});

	// get results function using type and location
	function getResults(type, location) {
		var result = $.ajax({
			url: "https://api.foursquare.com/v2/venues/explore?near=" + location + "&query=" + type + "&" + clientID + "&" + clientSecret + "&" + versionParam,
			dataType: "jsonp",
			type: "GET",
			})
		.done(function(result){
			$.each(result.response.groups.items, function(i, item) {
				var venueInfo = showVenue(item);
				$('.search-results').append(venueInfo);
			});
		})
	};

	// show venue information in DOM
	var showVenue = function(place) {

		var result = $('.template .venue-info').clone();
		var venueURL = 'http://foursquare.com/v/' + place.venue.id + '?ref=' + clientID;

		// set venue name and fsquare url
		var venueName = result.find('.venue-name a');
		venueName.attr('href', venueURL);
		venueName.text(place.venue.name);

		// set venue address
		var venueAddress = result.find('.address');
		venueAddress.text(place.venue.formattedAdress);

		// set venue category
		var venueCategory = result.find('.category');
		venueCategory.text(place.venue.categories.name);

		// set venue price
		var venuePrice = result.find('.price');
		venuePrice.text(place.venue.price.currency);

	};

	// get location function to gather user location
	function getLocation() {
		var x = document.getElementById("mylocation-error");

		if (navigator.geolocation){
			navigator.geolocation.getCurrentPosition(showPosition);
		} else {
			x.innerHTML = "Geolocation is not supported by this browser.";
		}
	};

	// get results using latitude and longitude
	function showPosition(latLng) {
		var lat = position.coords.latitude;
		var lng = position.coords.longitude;

		var result = $.ajax({
			url: "https://api.foursquare.com/v2/venues/explore?ll=" + lat + "," + lng + "&" + clientID + "&" + clientSecret + "&" + versionParam,
			dataType: "jsonp",
			type: "GET",
			})
		.done(function(result){
			$.each(result.response.groups.items, function(i, item) {
				var venueList = showVenue(item);
				$('.search-results').append(venueList);
			});
		})
	};

	// event when location button is clicked
	$('#mylocation').on('click', function(event){
		event.preventDefault();
		getLocation();
	});
});