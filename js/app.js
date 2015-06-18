$(function() {
	// variables
	var clientID = "client_id=TTPLKKHFQ2EUV42M5SIJG2FJ30SQBMCWQSSJTVHU304KYTYW";
	var clientSecret = "client_secret=40AH4GO1MG21QIZ5PSBLASDPD501VRI25FZKSL4KMXKC5D5L";
	var versionParam = "v=20140806";
	var site = "https://api.foursquare.com/v2/venues/explore"

	
	// search type and location input event
	$('#input-search').submit(function(event){
		showSpinner();

		var searchType = $('#looking-for').val();
		var searchLoc = $('#location').val();
		getResults(searchType, searchLoc);
		event.preventDefault();
	});

	function showSpinner() {
		$('#search-results img').show();
	};

	function showResults(result){
		$('#search-results img').hide();

        var count = result.response.groups[0].items.length;
        $('#search-results #results-list').html('');
        $('#resultsCount').html('<strong>Number of Results:</strong> '+ count)

        $.each(result.response.groups[0].items, function(i, item) {
            var venueInfo = showVenue(item);
            $('#search-results #results-list').append(venueInfo);
        });
	};

	// get results function using type and location
	function getResults(type, location) {
		var result = $.ajax({
			url: "https://api.foursquare.com/v2/venues/explore?near=" + location + "&query=" + type + "&" + clientID + "&" + clientSecret + "&" + versionParam,
			dataType: "jsonp",
			type: "GET",
			})
		.done(function(result){
			showResults(result);
		});
	};

	// show venue information in DOM
	var showVenue = function(place) {

		var template = $('.template .venue-info').clone();
		var venueURL = 'http://foursquare.com/v/' + place.venue.id + '?ref=' + clientID;

		// set venue name and fsquare url
		var venueName = template.find('.venue-name a');
		venueName.attr('href', venueURL);
		venueName.text(place.venue.name);

		// set venue address
		var venueAddress = template.find('.address');
		if (place.venue.location.address == undefined) {
			venueAddress.html(place.venue.location.city + ", " + place.venue.location.state);
		} else if (place.venue.location.postalCode == undefined) {
			venueAddress.html(place.venue.location.address + "<br />" + place.venue.location.city + ", " + place.venue.location.state);
		} else {
			venueAddress.html(place.venue.location.address + "<br />" + place.venue.location.city + ", " + place.venue.location.state + " " + place.venue.location.postalCode);
		}

		// set venue category
		var venueCategory = template.find('.category');
		if(place.venue.categories[0].name) {
			venueCategory.text(place.venue.categories[0].name);
		} else {
			venueCategory.text("None");
		}

		// set venue price
		var venuePrice = template.find('.price');
		if(place.venue.price){
            venuePrice.text(place.venue.price.currency);
        } else {
            venuePrice.text("$");
        }

		return template;

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
		var lat = latLng.coords.latitude;
		var lng = latLng.coords.longitude;

		var result = $.ajax({
			url: "https://api.foursquare.com/v2/venues/explore?ll=" + lat + "," + lng + "&" + clientID + "&" + clientSecret + "&" + versionParam,
			dataType: "jsonp",
			type: "GET",
			})
		.done(function(result){
			showResults(result);
		});
	};

	// event when location button is clicked
	$('#mylocation').on('click', function(event){
		event.preventDefault();
		getLocation();
		showSpinner();
	});
});