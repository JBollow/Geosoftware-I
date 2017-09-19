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
                    // shifting name from array
                    var stagename = array[0];
                    array.shift();

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

                    $("#stageinfobox").show();
                    $('#stageinfo').replaceWith("<table class='cleantable2' style='width:100%;'> <tr> <td style='width:49%;'> <div class='box boxscroll' style='height:220px;width: 100%; margin-bottom:20px'> <h2 style='font-size: 22px; margin-top: 10px;'>Start:</h2><br> <table class='cleantable2' style='width: 100%;'> <tr> <td> <img src=" + startpic + " width='100%'></td> </tr> <tr> <td>&nbsp;</td> </tr> <tr> <td><a target='_blank' class='linkjson' href=" + starturl + ">" + starturlname + "</a> </td> </tr> <tr> <td>&nbsp;</td> </tr> <tr> <td>Time and date:</td> <td>" + startdate + " </td> </tr> <tr> <td>&nbsp;</td></tr> <tr> <td>starttext </td> </tr> </table> </div> </td> <td style='width:1%;'></td> <td style='width:49%;'><div class='box boxscroll' style='height:220px;width: 100%; margin-bottom:20px'><h2 style='font-size: 22px; margin-top: 10px;'>End:</h2><br> <table class='cleantable2' style='width: 100%;'> <tr> <td> <img src=" + endpic + " width='100%'> </td> </tr> <tr> <td>&nbsp;</td> </tr> <tr> <td><a target='_blank' class='linkjson' href=" + endurl + ">" + endurlname + "</a> </td> </tr> <tr> <td>&nbsp;</td> </tr> <tr> <td>Time and date:</td> <td>" + enddate + " </td> </tr> <tr> <td>&nbsp;</td> </tr> <tr> <td>endtext </td> </tr> </table></div></td> </tr> </table>");

                    stageLayers.addLayer(stages);
                    map.addLayer(stageLayers);

                    array.forEach(function (entry) {

                        var id = entry._id;
                        var name = entry.geojson.name;
                        var geojsonLayer = L.geoJSON(entry.geojson);

                        controlLayers.removeLayer(geojsonLayer);

                        // Adding each geojson feature to the layergroup
                        stages.addLayer(geojsonLayer);

                        // Add popup
                        geojsonLayer.bindPopup(entry.geojson.properties.popupContent, {
                            maxWidth: "auto"
                        });
                    });

                    // Add controlLayer
                    controlLayers.addOverlay(stages, stagename);

                    // Adds a reference to the geojson into an array used by the control Layer clearer
                    stagegroup.push(stages);

                    // Adding the layernames to the legendlist, + commented checkboxes for something that I was interested in, but maybe never finished
                    $('#stagelegendelem').append("<li><p style='font-size: 14px;'>" + stagename + "</p></li>");


                    // Adding a legend + removebutton
                    $("#stagelegenddiv").show();
                    $("#stagelegendbtndiv").show();
                    $('#stagelegend').replaceWith("<h3>Stages:</h3>");
                    $('#stagelegendbtn').replaceWith("<input style='width: 100%;' type='button' class='button' value='&#x21bb; Remove all stages' onclick='removestage()'>");
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
        var array = object.stage;

        var stages = L.layerGroup([]);

        // shifting name from array
        var stagename = array[0];
        array.shift();

        stageLayers.addLayer(stages);
        map.addLayer(stageLayers);

        array.forEach(function (entry) {

            var id = entry._id;
            var name = entry.geojson.name;
            var geojsonLayer = L.geoJSON(entry.geojson);

            controlLayers.removeLayer(geojsonLayer);

            // Adding each geojson feature to the layergroup
            stages.addLayer(geojsonLayer);

            // Add popup
            geojsonLayer.bindPopup(entry.geojson.properties.popupContent, {
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