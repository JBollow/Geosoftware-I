/**
 *  @author Jan-Patrick Bollow 349891
 */

'use strict';

var errors;

/*
 save from leaflet draw to local disk
 @copyright April 19, 2017 Dan Swick
 @see https://bl.ocks.org/danswick/d30c44b081be31aea483
 */
document.getElementById('export').onclick = function (e) {
    // Extract GeoJson from editableLayer
    var data = editableLayers.toGeoJSON();

    // Stringify the GeoJson
    var convertedData = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));

    // Create export
    document.getElementById('export').setAttribute('href', 'data:' + convertedData);
    document.getElementById('export').setAttribute('download', 'data.geojson');
};

// Post json standalone
function postjsonsa(data) {
    var name = $("#jsonname").val();
    var text = $("#jsonpopuptext").val();
    var bild = $("#jsonbild").val();
    var link = $("#jsonweblink").val();
    var linkname = $("#jsonweblinkname").val();
    var type = $("#popuptype").val();
    var capacity = $("#jsoncap").val();
    var price = $("#jsonprice").val();

    // Add a name to the layer
    data.name = name;

    var properties = {
        picture: bild,
        text: text,
        link: link,
        linkname: linkname,
        type: type,
        capacity: capacity,
        price: price
    }

    // Add properties
    data.properties = properties;

    var senddata = JSON.stringify(data);

    // Post to local mongodb
    $.ajax({
        type: "POST",
        url: "http://localhost:3000/postjson",
        dataType: 'json',
        contentType: 'application/json',
        data: senddata,
        traditional: true,
        cache: false,
        processData: false,
        success: function () {
            swal("Success!", name + " added to FeatureDB", "success")
            getjson();
            // JSNLog
            logger.info("Post successful!");
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            sweetAlert('Oops...', 'Something went wrong!', 'error');
            // JSNLog
            logger.error("Posting failed!");
        },
        timeout: 3000
    });
};

// Post the geoJSON layer to DB
function postjson() {

    var namearray = [];
    var name = $("#jsonname").val();

    logger.info()

    // JSNLog
    logger.info('Name is!');
    logger.info(name);

    if (name != "") {
        // JSNLog
        logger.info('Start get');

        // Get all GeoJSON names from our DB using our GET
        $.ajax({
            type: "GET",
            url: "http://localhost:3000/getjson",
            success: function (response) {
                // JSNLog
                logger.info('Get successful!', response);

                // Using a forEach method iterating over the array of nested objects
                response.forEach(function (entry) {
                    namearray.push(entry.geojson.name);
                });

                // JSNLog
                logger.info(namearray);

                if ($.inArray(name, namearray) == -1) {
                    // Extract GeoJson from editableLayer
                    var data = editableLayers.toGeoJSON();

                    errors = geojsonhint.hint(data);
                    logger.info("Errors:");
                    logger.info(errors);

                    if (errors === undefined || errors.length == 0) {

                        postjsonsa(data);

                    } else {
                        sweetAlert('Oops...', 'There is something wrong with with this GeoJSON!', 'error');
                        // JSNLog
                        logger.info('Error in GeoJSON!');
                    }

                } else {
                    // JSNLog
                    logger.error('Name already in use!', name);
                    sweetAlert('Featurename already in use!', 'Please use another name for your feature.', 'error');
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



    } else {
        // JSNLog
        logger.error('No name', name);
        sweetAlert('No featurename!', 'Please name your feature.', 'error');
    }
};