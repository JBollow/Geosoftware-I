/**
 *  @author Jan-Patrick Bollow 349891
 */

'use strict';

/**
 * Initializing routing control
 */
var control = L.Routing.control({
    waypoints: [null],
    routeWhileDragging: true,
    show: true,
    position: 'topright',
    autoRoute: true,
    geocoder: L.Control.Geocoder.nominatim()
}).addTo(map);
// JSNLog
logger.info("Routing control is ready");

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
                $('#legendelem').append("<li><p><input name='routes' type='radio' id=" + entry._id + "> " + entry.geojson.routeName + "</p></li><script>$('#" + entry._id + "').change(function(){if($(this).is(':checked')){control.show();$('#checkroute').prop('checked',true);var id=$(this).attr('id');control.getPlan().setWaypoints({latLng:L.latLng([null])});$.ajax({type:'GET',url:'http://localhost:3000/getroute',success:function(response){response.forEach(function(entry){if(entry._id==id){control.setWaypoints(entry.geojson.navigationPoints);}});},error:function(responsedata){control.getPlan().setWaypoints({latLng:L.latLng([null])});alert('Failed!');}}).error(function(responsedata){control.getPlan().setWaypoints({latLng:L.latLng([null])});alert('Failed!');});}});</script>");
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
    } else {
        control.hide();
    }
});