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

    // JSNLog
    logger.info("endurl");
    logger.info(endurl);

    var ishttpend = endurl.indexOf("https://" || "http://" || "HTTPS://" || "HTTP://");

    // JSNLog
    logger.info("ishttpend");
    logger.info(ishttpend);

    // URL check for HTTP:
    if (ishttpend == 0) {

        endurl = endurl;
        // JSNLog
        logger.info("endurl mit");
        logger.info(endurl);

    } else {

        endurl = "http://" + endurl;
        // JSNLog
        logger.info("endurl ohne");
        logger.info(endurl);

    }

    // JSNLog
    logger.info("starturl");
    logger.info(starturl);

    var ishttpstart = starturl.indexOf("https://" || "http://" || "HTTPS://" || "HTTP://");

    // JSNLog
    logger.info("ishttpstart");
    logger.info(ishttpstart);

    // URL check for HTTP:
    if (ishttpstart == 0) {

        starturl = starturl;
        // JSNLog
        logger.info("starturl mit");
        logger.info(starturl);

    } else {

        starturl = "http://" + starturl;
        // JSNLog
        logger.info("starturl ohne");
        logger.info(starturl);

    }

    $("#stageinfobox").show();
    $('#stageinfo').replaceWith("<table class='cleantable2' style='width:100%;'> <tr> <td style='width:49%;'> <div class='box boxscroll' style='height:220px;width: 100%; margin-bottom:20px'> <h2 style='font-size: 22px; margin-top: 10px;'>Start: <b>" + startname + "</b></h2><br><img style='width:70%' src='" + startpic + "'><br><br><a target='_blank' class='linkjson' href='" + starturl + "'>" + starturlname + "</a><br><br>Time and date: " + startdate + " <br><br>" + starttext + " <br><br><br><b>Wikipedia:<b/><br><br><div id='articlestart'></div></div> </td> <td style='width:1%;'></td> <td style='width:49%;'><div class='box boxscroll' style='height:220px;width: 100%; margin-bottom:20px'><h2 style='font-size: 22px; margin-top: 10px;'>End: <b>" + endname + "</b></h2><br><img style='width:70%;' src='" + endpic + "'> <br><br><a target='_blank' class='linkjson' href='" + endurl + "'>" + endurlname + "</a><br><br>Time and date: " + enddate + " <br><br>" + endtext + " <br><br><br><b>Wikipedia:<b/><br><br><div id='articleend'></div></div></td></tr></table>");

    // Using Wikipedia Api to get some information
    // Source:http://www.9bitstudios.com/2014/03/getting-data-from-the-wikipedia-api-using-jquery/
    $.ajax({
        type: "GET",
        url: "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=" + startname + "&callback=?",
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var markup = data.parse.text["*"];
            var blurb = $('<div></div>').html(markup);

            // remove links as they will not work
            blurb.find('a').each(function () {
                $(this).replaceWith($(this).html());
            });

            // remove any references
            blurb.find('sup').remove();

            // remove cite error
            blurb.find('.mw-ext-cite-error').remove();

            logger.info("blurb");
            logger.info(blurb);

            $('#articlestart').html($(blurb).find('p'));

        },
        error: function (errorMessage) {}
    });

    $.ajax({
        type: "GET",
        url: "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=" + endname + "&callback=?",
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var markup = data.parse.text["*"];
            var blurb = $('<div></div>').html(markup);

            // remove links as they will not work
            blurb.find('a').each(function () {
                $(this).replaceWith($(this).html());
            });

            // remove any references
            blurb.find('sup').remove();

            // remove cite error
            blurb.find('.mw-ext-cite-error').remove();

            $('#articleend').html($(blurb).find('p'));

        },
        error: function (errorMessage) {}
    });

};