/**
 * authors: Jan-Patrick Bollow 349891, Sebastian Holtkamp, Joshua Bagert
 *
 */

'use strict';

/**
 * Initializing the map
 */
var map = L.map('map');
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);
// JSNLog
JL().info("The map is ready");


/**
 * Initializing routing control
 */
var control = L.Routing.control({
    waypoints: [
        L.latLng(51.960, 7.626),
        L.latLng(51.960, 7.626)
    ],
    routeWhileDragging: true,
    show: true,
    autoRoute: true,
    geocoder: L.Control.Geocoder.nominatim()
}).addTo(map);
// JSNLog
JL().info("Routing control is ready");


/** Sebastian Edit 2017-07-17 */
document.getElementById('post2db').onclick = function (e) {

    var currentRoute;
    
    control.on('routeselected', function (e) {
        console.log('create');
        currentRoute = e.route.coordinates;
        console.log(currentRoute);
    });

    // JSNLog: Logs the start and end coordinates
    JL().info(control.getWaypoints());

    var JSONtoPOST = {
        "routeName": $("#jsonname").val(),
        "navigationPoints": control.getWaypoints(),
        "coordinates": currentRoute
    };

    // Post to local mongodb via nodejs using our own POST
    $.ajax({
        type: "POST",
        url: "http://localhost:3000/postroute",
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(JSONtoPOST),
        traditional: true,
        cache: false,
        processData: false,
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

};
/**Sebastian Edit Ende */


/**
 * Old version of POST


// Post the route to DB
document.getElementById('post2db').onclick = function (e) {

    var routeArray = new Array();
    routeArray = control.getWaypoints();
    // Add a name to the route
    routeArray.splice(0, 0, $("#jsonname").val());

    // JSNLog
    JL().info(routeArray);

    var senddata = JSON.stringify(routeArray);

    // Post to local mongodb via nodejs using our own POST
    $.ajax({
        type: "POST",
        url: "http://localhost:3000/postroute",
        dataType: 'json',
        contentType: 'application/json',
        data: senddata,
        traditional: true,
        cache: false,
        processData: false,
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
};

 */

// Get the route from DB 
document.getElementById('loaddb').onclick = function (e) {

    // clearLayers before adding to prevent duplicates
    $("#legendelem").empty();

    // Adding a legend + removebutton
    $("#legenddiv").show();
    $("#legendbtndiv").show();
    $('#legend').replaceWith("<h2>Routes:</h2>");
    // Not pretty but works best, we tried a lot!
    $('#legendbtn').replaceWith("<input style='width: 100%;' type='button' class='button' value='&#x21bb; Remove all' onclick='location.reload();'>");
    // $('#legendbtn').replaceWith("<input style='width: 100%;' type='button' class='button' value='Remove all layers' onclick='remove()'>");

    // Get all GeoJSON from our DB using our GET
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/getroute",
        success: function (response) {

            // JSNLog
            logger.info('Get successful!' + response);

            // Using a forEach method iterating over the array of nested objects
            response.forEach(function (entry) {

                // JSNLog
                logger.info(entry.geojson);

                $('#legendelem').append("<li><p> <!--<input type='checkbox' checked>--> " + entry.geojson.routeName + "</p></li>");

                // Used in older version that worked with an array
                // $('#legendelem').append("<li><p> <!--<input type='checkbox' checked>--> " + entry.geojson[0] + "</p></li>");
                // entry.geojson.shift()

                var newroute = L.Routing.control({
                    waypoints: entry.geojson.navigationPoints,
                    routeWhileDragging: true,
                    show: true,
                    autoRoute: true,
                    geocoder: L.Control.Geocoder.nominatim()
                }).addTo(map);

                entry.geojson.navigationPoints.forEach(function (entry) {
                    // JSNLog
                    logger.info(entry.latLng.lat);
                    logger.info(entry.latLng.lng);
                })

            });

        },
        error: function (responsedata) {

            // If something fails, cleaning the legend and jsonlayers

            $("#legendelem").empty();
            $("#legenddiv").hide();
            $("#legendbtndiv").hide();
            alert("Failed!");
            // JSNLog
            logger.error('Failed in!' + response);
        }
    }).error(function (responsedata) {

        // If something fails, cleaning the legend and jsonlayers

        $("#legendelem").empty();
        $("#legenddiv").hide();
        $("#legendbtndiv").hide();
        alert("Failed!");
        // JSNLog
        logger.error('Failed out!' + response);
    });
};


// Removing all layers and hiding the legend
function remove() {
    // control._container.style.display = "None";
    // map.removeControl(map.routingControl);
};