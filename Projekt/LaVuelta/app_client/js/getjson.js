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
function getjson() {

    // clearLayers before adding to prevent duplicates
    jsonLayers.clearLayers();
    $("#jsonlegendelem").empty();

    // Get all GeoJSON from our DB using our GET
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/getjson",
        success: function (response) {
            // JSNLog
            logger.info('Get successful!', response);

            if (response.length == 0) {
                jsonLayers.clearLayers();
                $("#jsonlegendelem").empty();
                $("#jsonlegenddiv").hide();
                $("#jsonlegendbtndiv").hide();
                
            } else {
                // Using a forEach method iterating over the array of nested objects
                response.forEach(function (entry) {

                    var id = new L.FeatureGroup();
                    map.addLayer(jsonLayers);

                    // var jsonLayers = new L.FeatureGroup();
                    // map.addLayer(jsonLayers);

                    // JSNLog
                    // logger.info('JSON.stringify(entry.geojson)');
                    // logger.info(JSON.stringify(entry.geojson));

                    // Adding each geojson feature to the jsonLayers
                    L.geoJSON(entry.geojson).addTo(jsonLayers);

                    // Adding the layernames to the legendlist, + commented checkboxes for something that I was interested in, but maybe never finished
                    $('#jsonlegendelem').append("<li style='height: 30px;width: 100%;'><div class='title'><p style='font-size: 14px;display: inline;'>" + entry.geojson.name + "</p></div><div class='content'><button class='delbutton' type='button' id='" + entry._id + "' onclick='editfeature(this.id)'><i class='fa fa-pencil' aria-hidden='true'></i></button><button class='delbutton' type='button' id='" + entry._id + "' onclick='deletefeature(this.id)'><i class='fa fa-trash' aria-hidden='true'></i></button></div></li>");
                });

                // Adding a legend + removebutton
                $("#jsonlegenddiv").show();
                $("#jsonlegendbtndiv").show();
                $('#jsonlegend').replaceWith("<h3>Features:</h3>");
                $('#jsonlegendbtn').replaceWith("<table class='cleantable' style='width: 100%; padding: 0px;'><tr><td style='width: 50%;padding: 0px;'><button style='width: 100%;' type='button' class='button jsonupbtn' value='' onclick='removelayer()'>&#x21bb; Remove all features</button></td><td style='width: 50%;padding: 0px;'><button style='margin-left: 1px;width: 100%;' type='button' class='buttondel jsonupbtn' value='' id='deletefeaturedb' style='width: 100%;'onclick='deleteallfeature()'><i class='fa fa-trash' aria-hidden='true'></i> Delete all features</button></td></tr></table>");
            }
        },
        error: function (responsedata) {

            // If something fails, cleaning the legend and jsonlayers
            jsonLayers.clearLayers();
            $("#jsonlegendelem").empty();
            $("#jsonlegenddiv").hide();
            $("#jsonlegendbtndiv").hide();
            sweetAlert('Oops...', 'Something went wrong!', 'error');
            // JSNLog
            logger.error('Failed in!', response);
        },
        timeout: 3000
    }).error(function (responsedata) {

        // If something fails, cleaning the legend and jsonlayers
        jsonLayers.clearLayers();
        $("#jsonlegendelem").empty();
        $("#jsonlegenddiv").hide();
        $("#jsonlegendbtndiv").hide();
        sweetAlert('Oops...', 'Something went wrong!', 'error');
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

// Import JSON from Link
