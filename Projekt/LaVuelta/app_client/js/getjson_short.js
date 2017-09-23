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

                    var popup = "<h2>" + name + "</h2><hr><img style='max-width:200px;max-height:100%;' src='" + bild + "'><p style='font-size: 14px;'>" + text + "<br><br><a target='_blank' href='" + link + "'>" + linkname + "</a><br><br>" + typeinfo + "</p><hr><h2>Navigation</h2><table class='cleantable'><tr><td><button type='button' class='buttonpur' value='Start here!' id='" + id + "' onclick='navstart(id);' style='margin: 0px;width: 100%;'><i class='fa fa-arrow-up' aria-hidden='true'></i> Start here!</button></td><td style='padding: 0px 0px 0px 1px;'><button type='button' class='buttonpur' value='End here!' id='" + id + "' onclick='navend(id);' style='margin: 0px;width: 100%;'><i class='fa fa-arrow-down' aria-hidden='true'></i> End here!</button></td></tr></table><br><button type='button' class='buttonpur' value='Nearest parkingspace!' id='" + id + "' onclick='navpark(id)' style='margin: 0px;width: 100%;'><i class='fa fa-car' aria-hidden='true'></i> Nearest parkingspace!</button>";

                    // Different popups depending on type
                    if (type == "default") {

                        typeinfo = "";

                    } else {

                        if (type == "parkingplace") {

                            typeinfo = "<b>Capacity: " + capacity + " spots</b><br><b>Price: " + price + " €</b>";

                            var popup = "<h2>" + name + "</h2><hr><img style='max-width:200px;max-height:100%;' src='" + bild + "'><p style='font-size: 14px;'>" + text + "<br><br><a target='_blank' href='" + link + "'>" + linkname + "</a><br><br>" + typeinfo + "</p><hr><h2>Navigation</h2><table class='cleantable'><tr><td><button type='button' class='buttonpur' value='Start here!' id='" + id + "' onclick='navstart(id);' style='margin: 0px;width: 100%;'><i class='fa fa-arrow-up' aria-hidden='true'></i> Start here!</button></td><td style='padding: 0px 0px 0px 1px;'><button type='button' class='buttonpur' value='End here!' id='" + id + "' onclick='navend(id);' style='margin: 0px;width: 100%;'><i class='fa fa-arrow-down' aria-hidden='true'></i> End here!</button></td></tr></table>";


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
                    $('#jsonlegendelem').append("<li><p style='font-size: 14px;'>" + entry.geojson.name + "</p></li>");
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


// Navigation Start
function navstart(id) {

    $.ajax({
        type: "GET",
        url: "http://localhost:3000/getjson",
        success: function (response) {
            // JSNLog
            logger.info('Get successful!', response);

            if (response.length == 0) {

                sweetAlert('Oops...', 'Something went wrong!', 'error');
                // JSNLog
                logger.error('Response empty!', response);

            } else {

                // Using a forEach method iterating over the array of nested objects
                response.forEach(function (entry) {

                    var identry = entry._id;

                    if (identry == id) {

                        // Check what kind of feature it is
                        if (entry.geojson.features[0].geometry.type == "Point") {

                            var lat = entry.geojson.features[0].geometry.coordinates[1];
                            var lng = entry.geojson.features[0].geometry.coordinates[0];

                        } else {
                            if (entry.geojson.features[0].geometry.type == "LineString" || "MultiPoint") {

                                var lat = entry.geojson.features[0].geometry.coordinates[0][1];
                                var lng = entry.geojson.features[0].geometry.coordinates[0][0];

                            } else {

                                var lat = entry.geojson.features[0].geometry.coordinates[0][0][1];
                                var lng = entry.geojson.features[0].geometry.coordinates[0][0][0];

                            }

                        }

                        // Set startpoint
                        var navstart = {
                            "lat": lat,
                            "lng": lng
                        };

                        // JSNLog
                        logger.info("navstart");
                        logger.info(navstart);

                        control.spliceWaypoints(0, 1, navstart);
                        control.show();

                    }

                });

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

}

// Navigation End
function navend(id) {
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/getjson",
        success: function (response) {
            // JSNLog
            logger.info('Get successful!', response);

            if (response.length == 0) {

                sweetAlert('Oops...', 'Something went wrong!', 'error');
                // JSNLog
                logger.error('Response empty!', response);

            } else {

                // Using a forEach method iterating over the array of nested objects
                response.forEach(function (entry) {

                    var identry = entry._id;

                    if (identry == id) {

                        // Check what kind of feature it is
                        if (entry.geojson.features[0].geometry.type == "Point") {

                            var lat = entry.geojson.features[0].geometry.coordinates[1];
                            var lng = entry.geojson.features[0].geometry.coordinates[0];

                        } else {
                            if (entry.geojson.features[0].geometry.type == "LineString" || "MultiPoint") {

                                var lat = entry.geojson.features[0].geometry.coordinates[0][1];
                                var lng = entry.geojson.features[0].geometry.coordinates[0][0];

                            } else {

                                var lat = entry.geojson.features[0].geometry.coordinates[0][0][1];
                                var lng = entry.geojson.features[0].geometry.coordinates[0][0][0];

                            }

                        }

                        // Set endpoint
                        var navend = {
                            "lat": lat,
                            "lng": lng
                        };

                        // JSNLog
                        logger.info("navend");
                        logger.info(navend);

                        control.spliceWaypoints(control.getWaypoints().length - 1, 1, navend);
                        control.show();

                    }

                });

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
}

// Navigate to nearest parking space
function navpark(id) {

    $.ajax({
        type: "GET",
        url: "http://localhost:3000/getjson",
        success: function (response) {
            // JSNLog
            logger.info('Get successful!', response);

            if (response.length == 0) {

                sweetAlert('Oops...', 'Something went wrong!', 'error');
                // JSNLog
                logger.error('Response empty!', response);

            } else {

                var latstart;
                var lngstart;
                var dist;
                var distold = 20000;
                var noparking = true;
                var navend = {
                    "lat": null,
                    "lng": null
                };

                // Using a forEach method iterating over the array of nested objects
                response.forEach(function (entry) {

                    var type = entry.geojson.properties.type;
                    var identry = entry._id;

                    if (identry == id) {

                        // Check what kind of feature it is
                        if (entry.geojson.features[0].geometry.type == "Point") {

                            var lat = entry.geojson.features[0].geometry.coordinates[1];
                            var lng = entry.geojson.features[0].geometry.coordinates[0];

                        } else {
                            if (entry.geojson.features[0].geometry.type == "LineString" || "MultiPoint") {

                                var lat = entry.geojson.features[0].geometry.coordinates[0][1];
                                var lng = entry.geojson.features[0].geometry.coordinates[0][0];

                            } else {

                                var lat = entry.geojson.features[0].geometry.coordinates[0][0][1];
                                var lng = entry.geojson.features[0].geometry.coordinates[0][0][0];

                            }

                        }

                        // Set startpoint
                        var navstart = {
                            "lat": lat,
                            "lng": lng
                        };

                        latstart = lat;
                        lngstart = lng;

                        // JSNLog
                        logger.info("navstart");
                        logger.info(navstart);

                        control.spliceWaypoints(0, 1, navstart);
                    }
                })

                response.forEach(function (entry) {

                    var type = entry.geojson.properties.type;

                    if (type == "parkingplace") {

                        // Check what kind of feature it is
                        if (entry.geojson.features[0].geometry.type == "Point") {

                            var lat = entry.geojson.features[0].geometry.coordinates[1];
                            var lng = entry.geojson.features[0].geometry.coordinates[0];

                        } else {
                            if (entry.geojson.features[0].geometry.type == "LineString") {

                                var lat = entry.geojson.features[0].geometry.coordinates[0][1];
                                var lng = entry.geojson.features[0].geometry.coordinates[0][0];

                            } else {

                                var lat = entry.geojson.features[0].geometry.coordinates[0][0][1];
                                var lng = entry.geojson.features[0].geometry.coordinates[0][0][0];

                            }

                        }

                        // Calculate distance from start
                        dist = getDistanceFromLatLonInKm(latstart, lngstart, lat, lng);

                        if (dist < distold) {

                            // Set endpoint
                            navend.lat = lat;
                            navend.lng = lng;
                            distold = dist;
                            noparking = false;

                            // JSNLog
                            logger.info("dist");
                            logger.info(dist);

                        }


                    };

                })

                if (noparking) {
                    sweetAlert('Oops...', 'Sorry, no parkingspace found!', 'error');
                    // JSNLog
                    logger.error('No parkingspace!');
                } else {

                    // JSNLog
                    logger.info("navend");
                    logger.info(navend);

                    control.spliceWaypoints(control.getWaypoints().length - 1, 1, navend);
                    control.show();
                }

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
}

// Used to calculate the distance to the closest parking space
// not using distance from mapzen, because it causes much trouble and traffic 
// Source: https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}