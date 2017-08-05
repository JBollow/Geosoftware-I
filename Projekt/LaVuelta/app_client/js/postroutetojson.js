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
document.getElementById('post2dbasjson').onclick = function (e) {

	// JSNLog
	logger.info("JSON.stringify(routeactive)");
	logger.info(JSON.stringify(routeactive));
	logger.info("JSON.stringify(routeactive.waypoints)");
	logger.info(JSON.stringify(routeactive.waypoints));
	logger.info("RouteToGeoJSON(routeactive)");
	logger.info(RouteToGeoJSON(routeactive));


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
				alert($("#jsonname").val() + " added to DB");
				// JSNLog
				logger.info("Post successful!");
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				alert("Failed!");
				// JSNLog
				logger.error("Posting failed!");
			}
		});
		// JSNLog
		logger.error("no routeactive!");
		return false;
	}

};