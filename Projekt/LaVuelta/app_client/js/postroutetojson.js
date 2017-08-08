/**
 *  @author Jan-Patrick Bollow 349891
 */

'use strict';

var routeactive;

// event listener
// Source: https://gis.stackexchange.com/questions/186757/leaflet-routing-machine-how-to-export-route-details-and-coordinates-in-json-g
control.on('routeselected', function (e) {
	routeactive = {};
	routeactive.waypoints = control.getWaypoints();
	routeactive.route = e.route;
})

// Source: https://github.com/perliedman/leaflet-routing-machine/blob/344ff09c8bb94d4e42fa583286d95396d8227c65/src/L.Routing.js
function routeToLineString(route) {
	var lineCoordinates = [],
		i,
		latLng;

	for (i = 0; i < route.route.coordinates.length; i++) {
		latLng = L.latLng(route.route.coordinates[i]);
		lineCoordinates.push([latLng.lng, latLng.lat]);
	}

	return {
		type: 'LineString',
		coordinates: lineCoordinates
	};
}

// Source: https://github.com/perliedman/leaflet-routing-machine/blob/344ff09c8bb94d4e42fa583286d95396d8227c65/src/L.Routing.js
function RouteToGeoJSON(route) {
	var wpNames = [],
		wpCoordinates = [],
		i,
		wp,
		latLng;

	for (i = 0; i < route.waypoints.length; i++) {
		wp = route.waypoints[i];
		latLng = L.latLng(wp.latLng);
		wpNames.push(wp.name);
		wpCoordinates.push([latLng.lng, latLng.lat]);
	}
	return {
		type: 'FeatureCollection',
		features: [{
				type: 'Feature',
				properties: {
					id: 'waypoints',
					names: wpNames
				},
				geometry: {
					type: 'MultiPoint',
					coordinates: wpCoordinates
				}
			},
			{
				type: 'Feature',
				properties: {
					id: 'line',
				},
				geometry: routeToLineString(route)
			}
		]
	};
}


// Post the route to DB as json
function post2dbasjson() {

	if (control.getWaypoints()[1].latLng == null) {
		// JSNLog
		logger.error('No route', );
		sweetAlert('No route!', 'Please make a route first', 'error');

	} else {

		var namearray = [];
		var name = $("#jsonname").val();

		// JSNLog
		logger.info('Name is!');
		logger.info(name);

		if (name != "") {


			// Get all GeoJSON names from our DB using our GET
			$.ajax({
				type: "GET",
				url: "http://localhost:3000/getjson",
				success: function (response) {
					// JSNLog
					logger.info('Get successful!');
					logger.info(response);
					// Using a forEach method iterating over the array of nested objects
					response.forEach(function (entry) {
						namearray.push(entry.geojson.name);
					});

					// JSNLog
					logger.info(namearray);
					logger.info(name);

					if ($.inArray(name, namearray) == -1) {
						if (routeactive) {

							// JSNLog
							logger.info("routeactive!");

							var routejson = RouteToGeoJSON(routeactive);

							routejson.name = $("#jsonname").val();

							var sendroutejson = JSON.stringify(routejson);

							// submit via ajax
							$.ajax({
								type: "POST",
								url: "http://localhost:3000/postjson",
								dataType: 'json',
								contentType: 'application/json',
								traditional: true,
								cache: false,
								processData: false,
								data: sendroutejson,
								success: function () {
									swal("Success!", $("#jsonname").val() + " added to FeatureDB", "success")
									// JSNLog
									logger.info("Post successful!");
								},
								error: function (XMLHttpRequest, textStatus, errorThrown) {
									sweetAlert("Oops...", "Route " + $("#jsonname").val() + " is too large!", "error");
									// JSNLog
									logger.error("Posting failed!");
								},
								timeout: 3000
							});
							return false;
						} else {
							logger.error("routeactive is false :(");
							sweetAlert("Oops...", "The routing service has a problem, please try again later.", "error");
						}

					} else {
						// JSNLog
						logger.error('Name already in use!', name);
						sweetAlert('Featurename already in use!', 'Please use another name for your feature.', 'error');
					}
				},
				error: function (responsedata) {
					sweetAlert('Oops...', 'Something went wrong!', 'error');
					// JSNLog
					logger.error('Failed in!', response);
				},
				timeout: 3000
			}).error(function (responsedata) {
				sweetAlert('Oops...', 'Something went wrong!', 'error');
				// JSNLog
				logger.error('Failed out!', response);
			});

		} else {
			// JSNLog
			logger.error('No name', name);
			sweetAlert('No featurename!', 'Please name your feature.', 'error');
		}


	}
};