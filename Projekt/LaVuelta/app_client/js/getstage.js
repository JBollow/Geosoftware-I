/**
 *  @author Jan-Patrick Bollow 349891
 */

'use strict';

/**
 * Declaring the layers with drawn objects
 * and adding them to the map
 */
// Added extra jsonLayer for DB layers
var stageLayers = new L.FeatureGroup();
var stagegroup = [];
var errors, data;

// Get the geoJSON layers from DB 
function getstage() {

    // clearLayers before adding to prevent duplicates
    stageLayers.clearLayers();
    $("#stagelegendelem").empty();

    // Clears the control Layers
    if (stagegroup) {
        stagegroup.forEach(function (entry) {
            controlLayers.removeLayer(entry);
        })
    };

    // Get all GeoJSON from our DB using our GET
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/getstage",
        success: function (response) {
            // JSNLog
            logger.info('Get successful!', response);
            if (response.length == 0) {
                stageLayers.clearLayers();
                $("#stagelegendelem").empty();
                $("#stagelegenddiv").hide();
                $("#stagelegendbtndiv").hide();
            } else {

                response.forEach(function (entry) {
                    var array = entry.geojson.stage;
                    var stages = L.layerGroup([]);
                    var id = entry._id;

                    // shifting name from array
                    var stagename = array[0];
                    array.shift();


                    shifter(array);

                    stageLayers.addLayer(stages);
                    map.addLayer(stageLayers);

                    array.forEach(function (entry) {

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

                        // Adding each geojson feature to the layergroup
                        stages.addLayer(geojsonLayer);

                        // Add popup
                        geojsonLayer.bindPopup(popup, {
                            maxWidth: "auto"
                        });
                    });

                    // Add controlLayer
                    controlLayers.addOverlay(stages, stagename);

                    // Adds a reference to the geojson into an array used by the control Layer clearer
                    stagegroup.push(stages);

                    // Adding the layernames to the legendlist
                    $('#stagelegendelem').append("<li style='height: 30px;width: 100%;'><div class='title'><p style='font-size: 14px;display: inline;'>" + stagename + "</p></div><div class='content'><a target='_blank' href='http://localhost:3000/stage/" + id + "' class='linkjson'><p class='linkjsonper'>&nbsp;<i class='fa fa-link' aria-hidden='true'></i>&nbsp;</p></a><button class='delbutton' type='button' id='" + id + "' onclick='editstage(this.id)'><i class='fa fa-pencil' aria-hidden='true'></i></button><button class='delbutton' type='button' id='" + id + "' onclick='deletestage(this.id)'><i class='fa fa-trash' aria-hidden='true'></i></button></div></li>");


                    // Adding a legend + removebutton
                    $("#stagelegenddiv").show();
                    $("#stagelegendbtndiv").show();
                    $('#stagelegend').replaceWith("<h3>Stages:</h3>");
                    $('#stagelegendbtn').replaceWith("<table class='cleantable' style='width: 100%; padding: 0px;'><tr><td style='width: 50%;padding: 0px;'><button style='width: 100%;' type='button' class='button jsonupbtn' value='' onclick='removestage()'>&#x21bb; Remove all stages</button></td><td style='width: 50%;padding: 0px;'><button style='margin-left: 1px;width: 100%;' type='button' class='buttondel jsonupbtn' value='' id='deletestagedb' style='width: 100%;'onclick='deleteallstages()'><i class='fa fa-trash' aria-hidden='true'></i> Delete all stages</button></td></tr></table>");
                })
            }
        },
        error: function (responsedata) {

            // If something fails, cleaning the legend and stageLayers
            stageLayers.clearLayers();
            $("#stagelegendelem").empty();
            $("#stagelegenddiv").hide();
            $("#stagelegendbtndiv").hide();
            sweetAlert('Oops...', 'Something went wrong!', 'error');
            // JSNLog
            logger.error('Failed in!', response);
        },
        timeout: 3000
    }).error(function (responsedata) {

        // If something fails, cleaning the legend and stageLayers
        stageLayers.clearLayers();
        $("#stagelegendelem").empty();
        $("#stagelegenddiv").hide();
        $("#stagelegendbtndiv").hide();
        sweetAlert('Oops...', 'Something went wrong!', 'error');
        // JSNLog
        logger.error('Failed out!', response);
    });

    // JSNLog
    logger.info(stageLayers);
};

// Importing stage from file to stages
function importstage(event) {
    // Reader from input
    var reader = new FileReader();

    reader.readAsText(event.target.files[0]);
    reader.onload = function (event) {
        data = event.target.result;

        // Parse data to object
        var object = JSON.parse(data);

        // Use array in object.stage
        var array = object.geojson.stage;
        var stages = L.layerGroup([]);

        // shifting name from array
        var stagename = array[0];
        array.shift();

        shifter(array);

        stageLayers.addLayer(stages);
        map.addLayer(stageLayers);

        array.forEach(function (entry) {

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

            // Adding each geojson feature to the layergroup
            stages.addLayer(geojsonLayer);

            // Add popup
            geojsonLayer.bindPopup(popup, {
                maxWidth: "auto"
            });
        });

        // Add controlLayer
        controlLayers.addOverlay(stages, stagename + " [imported]");

        // Adds a reference to the geojson into an array used by the control Layer clearer
        stagegroup.push(stages);

        // Adding the layernames to the legendlist, + commented checkboxes for something that I was interested in, but maybe never finished
        $('#stagelegendelem').append("<li><p style='font-size: 14px;display: inline;'>" + stagename + " </p><p style='font-size: 10px;display: inline;'>[imported]</p></li>");


        // Adding a legend + removebutton
        $("#stagelegenddiv").show();
        $("#stagelegendbtndiv").show();
        $('#stagelegend').replaceWith("<h3>Stages:</h3>");
        $('#stagelegendbtn').replaceWith("<input style='width: 100%;' type='button' class='button' value='&#x21bb; Remove all stages' onclick='removestage()'>");
    }
};

// Removing all layers and hiding the legend
function removestage() {
    stageLayers.clearLayers();

    // Clears the control Layers
    if (stagegroup) {
        stagegroup.forEach(function (entry) {
            controlLayers.removeLayer(entry);
        })
    };

    $("#stageinfobox").hide();
    $("#stagelegendelem").empty();
    $("#stagelegenddiv").hide();
    $("#stagelegendbtndiv").hide();
    // JSNLog
    logger.info("StageLayers removed, legend hidden");
};


// Shiftfunction for getstage
function shifter(array) {
    var startpic = array[0];
    array.shift();

    var starturlname = array[0];
    array.shift();

    var starturl = array[0];
    array.shift();

    var startdate = array[0];
    array.shift();

    var starttext = array[0];
    array.shift();


    var endpic = array[0];
    array.shift();

    var endurlname = array[0];
    array.shift();

    var endurl = array[0];
    array.shift();

    var enddate = array[0];
    array.shift();

    var endtext = array[0];
    array.shift();

    var startname = array[0];
    array.shift();

    var endname = array[0];
    array.shift();
};