/**
 *  @author Jan-Patrick Bollow 349891
 */

'use strict';

L.Mapzen.apiKey = 'mapzen-Viyke6a';

var control = true;

/**
 * Initializing routing control
 */
var control = reloadControl($('#language').val(), $('#transport').val());

function reloadControl(language, tansportation) {
    // Mapzen
    control = L.Routing.control({
        waypoints: [null],
        routeWhileDragging: true,
        showAlternatives: true,
        fitSelectedRoutes: true,
        reverseWaypoints: true,
        show: true,
        position: 'bottomleft',
        autoRoute: true,
        geocoder: L.Control.Geocoder.nominatim(),
        geocoder: L.Control.Geocoder.mapzen('mapzen-Viyke6a'),
        router: L.Routing.mapzen('mapzen-Viyke6a', {
            routeLine: function (route, options) {
                return L.Routing.mapzenLine(route, options);
            },
            directions_options: {
                language: language
            },
            costing: tansportation,
        }),
        formatter: new L.Routing.mapzenFormatter(),
        summaryTemplate: '<div class="route-info {costing}">{distance}, {time}</div>'
    }).addTo(map);
    return control;
    // JSNLog
    logger.info("Mapzen is ready");
}

// Reload language
function reloadLanguage() {
    var waypoints = control.getWaypoints();
    // JSNLog
    logger.info(waypoints);
    control.getRouter().options.directions_options.language = $('#language').val();
    // JSNLog
    logger.info("Language changed to: " + control.getRouter().options.directions_options.language);
    control.remove();
    reloadControl($('#language').val(), $('#transport').val());
    control.setWaypoints(waypoints);
}

// Reload transportation
function reloadTransport() {
    var waypoints = control.getWaypoints();
    // JSNLog
    control.getRouter().options.costing = $('#transport').val();
    // JSNLog
    logger.info("Transportation changed to: " + control.getRouter().options.costing);
    control.remove();
    reloadControl($('#language').val(), $('#transport').val());
    control.setWaypoints(waypoints);
}

function remover() {
    control.remove();
    // JSNLog
    logger.info("Control removed");
    reloadControl($('#language').val(), $('#transport').val());
    // JSNLog
    logger.info("Control rebuild");
}


// Get the route from DB 
document.getElementById('loaddb').onclick = function (e) {

    // clearLayers before adding to prevent duplicates
    $("#legendelem").empty();

    // Adding a legend + removebutton
    $("#legenddiv").show();
    $("#legendbtndiv").show();
    $('#legend').replaceWith("<h3>Routes:</h3>");
    $('#legendbtn').replaceWith("<input style='width: 100%;' type='button' class='button' value='&#x21bb; Remove all routes' onclick='removeroute();'>");

    // Get all GeoJSON from our DB using our GET
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/getroute",
        success: function (response) {

            // JSNLog
            logger.info('Get successful!');

            // Using a forEach method iterating over the array of nested objects
            response.forEach(function (entry) {

                // Ich habe ein Monster erschaffen, sorry, aber das war die Lösung die ich schon lange im Kopf hatte
                $('#legendelem').append("<li><p style='font-size: 14px;'><input name='routes' type='radio' id=" + entry._id + "> " + entry.geojson.routeName + "</p></li><script>$('#" + entry._id + "').change(function(){if($(this).is(':checked')){control.show();$('#checkroute').prop('checked',true);var id=$(this).attr('id');control.getPlan().setWaypoints({latLng:L.latLng([null])});$.ajax({type:'GET',url:'http://localhost:3000/getroute',success:function(response){response.forEach(function(entry){if(entry._id==id){control.remove();reloadControl(entry.geojson.language,entry.geojson.costing);$('#transport').val(entry.geojson.costing);$('#language').val(entry.geojson.language);control.setWaypoints(entry.geojson.navigationPoints);}});},error:function(responsedata){control.getPlan().setWaypoints({latLng:L.latLng([null])});alert('Failed!');}}).error(function(responsedata){control.getPlan().setWaypoints({latLng:L.latLng([null])});alert('Failed!');});}});logger.info('Changed route');</script>");
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
function removeroute() {
    control.getPlan().setWaypoints({
        latLng: L.latLng([null])
    });
    $("#legendelem").empty();
    $("#legenddiv").hide();
    $("#legendbtndiv").hide();
    control.hide();
    $("#checkroute").prop("checked", false);
};

// show/hide function for routecontrol 
$("#checkroute").change(function () {
    if ($(this).is(':checked')) {
        control.show();
        // JSNLog
        logger.info("Show control");
    } else {
        control.hide();
        // JSNLog
        logger.info("Hide control");
    }
});


// Locator found in a Mapzen example
var locator = L.Mapzen.locator();
locator.addTo(map);
// JSNLog
logger.info("Locator loaded");

// Mapzen errorControl
L.Routing.errorControl(control).addTo(map);
// JSNLog
logger.info("ErrorControl loaded");