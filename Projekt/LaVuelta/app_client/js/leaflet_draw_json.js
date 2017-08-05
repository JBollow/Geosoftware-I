/**
 *  @author Jan-Patrick Bollow 349891
 */

'use strict';

/**
 * Declaring the layers with drawn objects
 * and adding them to the map
 */
// Added extra jsonLayer for DB layers
var jsonLayers = new L.FeatureGroup();
map.addLayer(jsonLayers);

// Get the geoJSON layers from DB 
document.getElementById('jsonloaddb').onclick = function (e) {

    // clearLayers before adding to prevent duplicates
    jsonLayers.clearLayers();
    $("#jsonlegendelem").empty();

    // Adding a legend + removebutton
    $("#jsonlegenddiv").show();
    $("#jsonlegendbtndiv").show();
    $('#jsonlegend').replaceWith("<h3>Features:</h3>");
    $('#jsonlegendbtn').replaceWith("<input style='width: 100%;' type='button' class='button' value='&#x21bb; Remove all features' onclick='removelayer()'>");

    // Get all GeoJSON from our DB using our GET
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/getjson",
        success: function (response) {
            // JSNLog
            logger.info('Get successful!', response);

            // Using a forEach method iterating over the array of nested objects
            response.forEach(function (entry) {

                var id = new L.FeatureGroup();
                map.addLayer(jsonLayers);

                // var jsonLayers = new L.FeatureGroup();
                // map.addLayer(jsonLayers);

                // JSNLog
                logger.info('JSON.stringify(entry.geojson)', JSON.stringify(entry.geojson));

                // Adding each geojson feature to the jsonLayers
                L.geoJSON(entry.geojson).addTo(jsonLayers);

                // Adding the layernames to the legendlist, + commented checkboxes for something that I was interested in, but maybe never finished
                $('#jsonlegendelem').append("<li><p style='font-size: 14px;'>" + entry.geojson.name + "</p></li>");

            });
        },
        error: function (responsedata) {

            // If something fails, cleaning the legend and jsonlayers
            jsonLayers.clearLayers();
            $("#jsonlegendelem").empty();
            $("#jsonlegenddiv").hide();
            $("#jsonlegendbtndiv").hide();
            alert("Failed!");
            // JSNLog
            logger.error('Failed in!', response);
        }
    }).error(function (responsedata) {

        // If something fails, cleaning the legend and jsonlayers
        jsonLayers.clearLayers();
        $("#jsonlegendelem").empty();
        $("#jsonlegenddiv").hide();
        $("#jsonlegendbtndiv").hide();
        alert("Failed!");
        // JSNLog
        logger.error('Failed out!', response);
    });

    // JSNLog
    logger.info(jsonLayers);
};

// Removing all layers and hiding the legend
function removelayer() {
    jsonLayers.clearLayers();
    $("#jsonlegendelem").empty();
    $("#jsonlegenddiv").hide();
    $("#jsonlegendbtndiv").hide();
    // JSNLog
    logger.info("JsonLayers removed, legend hidden");
};