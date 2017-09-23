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
var group = [];
map.addLayer(jsonLayers);

// Get the geoJSON layers from DB 
function getjsonshort() {

    // clearLayers before adding to prevent duplicates
    jsonLayers.clearLayers();
    $("#jsonlegendelem").empty();

    // Clears the control Layers
    if (group) {
        group.forEach(function (entry) {
            controlLayers.removeLayer(entry);
        })
    };

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

                map.addLayer(jsonLayers);

                // Using a forEach method iterating over the array of nested objects
                response.forEach(function (entry) {

                    var id = entry._id;
                    var name = entry.geojson.name;
                    var geojsonLayer = L.geoJSON(entry.geojson);
                    var bild = entry.geojson.properties.picture;
                    var text = entry.geojson.properties.text;
                    var link = entry.geojson.properties.link;
                    var linkname = entry.geojson.properties.linkname;
                    var type = entry.geojson.properties.type;
                    var capacity = entry.geojson.properties.capacity;
                    var price = entry.geojson.properties.price;
                    var typeinfo = "";

                    // Different popups depending on type
                    if (type == "default") {

                        typeinfo = "";

                    } else {

                        if (type == "parkingplace") {

                            typeinfo = "<b>Capacity: " + capacity + " spots</b><br><b>Price: " + price + " €</b>";

                        } else {

                            if (type == "hotel") {

                                typeinfo = "<b>Capacity: " + capacity + " room</b><br><b>Price: " + price + " €</b>";

                            } else {

                                typeinfo = "";

                            }

                        }

                    }

                    // JSNLog
                    logger.info("link");
                    logger.info(link);

                    var ishttp = link.indexOf("https://" || "http://" || "HTTPS://" || "HTTP://");

                    // JSNLog
                    logger.info("ishttp");
                    logger.info(ishttp);

                    // URL check for HTTP:
                    if (ishttp == 0) {

                        link = link;
                        // JSNLog
                        logger.info("link mit");
                        logger.info(link);

                    } else {

                        link = "http://" + link;
                        // JSNLog
                        logger.info("link ohne");
                        logger.info(link);

                    }

                    // JSNLog
                    logger.info("typeinfo");
                    logger.info(typeinfo);

                    var popup = "<h2>" + name + "</h2><hr><img style='max-width:200px;max-height:100%;' src='" + bild + "'><p style='font-size: 14px;'>" + text + "<br><br><a target='_blank' href='" + link + "'>" + linkname + "</a><br><br>" + typeinfo + "</p>";

                    controlLayers.removeLayer(geojsonLayer);

                    // Adding each geojson feature to the jsonLayers and controlLayers
                    geojsonLayer.addTo(jsonLayers);

                    // Adds a reference to the geojson into an array used by the control Layer clearer
                    group.push(geojsonLayer);

                    // Add controlLayer
                    controlLayers.addOverlay(geojsonLayer, name);

                    // Add popup
                    geojsonLayer.bindPopup(popup, {
                        maxWidth: "auto"
                    });

                    // Adding the layernames to the legendlist, + commented checkboxes for something that I was interested in, but maybe never finished
                    $('#jsonlegendelem').append("<li><input type='checkbox' id='" + id + "'><p style='font-size: 14px;display: inline;'> " + name + "</p></li>");
                });
                // Adding a legend + removebutton
                $("#jsonlegenddiv").show();
                $("#jsonlegendbtndiv").show();
                $('#jsonlegend').replaceWith("<h3>Features:</h3>");
                $('#jsonlegendbtn').replaceWith("<input style='width: 100%;' type='button' class='button' value='&#x21bb; Remove all features' onclick='removelayer()'>");
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

    // Clears the control Layers
    if (group) {
        group.forEach(function (entry) {
            controlLayers.removeLayer(entry);
        })
    };

    $("#jsonlegendelem").empty();
    $("#jsonlegenddiv").hide();
    $("#jsonlegendbtndiv").hide();
    // JSNLog
    logger.info("JsonLayers removed, legend hidden");
};