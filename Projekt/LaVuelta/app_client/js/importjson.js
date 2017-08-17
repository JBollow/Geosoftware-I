/**
 *  @author Jan-Patrick Bollow 349891
 */

'use strict';

// Controll: overlayMaps
// Layer: jsonLayers

var geojsonLayer = L.geoJSON().addTo(map);
var errors, data;

// Importing geoJson from link to geojsonLayer
function importjsonlink() {
    // URL from input
    var url = $("#jsonlink").val();
    if (url == "") {
        // JSNLog
        logger.info("No URL");
        sweetAlert('Oops...', 'You need to enter an URL!', 'error');
    } else {
        $.getJSON(url, function (data) {

            errors = geojsonhint.hint(data);
            logger.info("Errors:");
            logger.info(errors);

            if (errors === undefined || errors.length == 0) {

                // JSNLog
                logger.info(data);
                geojsonLayer.addData(data);

            } else {
                sweetAlert('Oops...', 'There is something wrong with with this GeoJSON!', 'error');
                // JSNLog
                logger.info('Error in GeoJSON!');
            }
        }).error(function () {
            sweetAlert('Oops...', 'There is something wrong with the URL!', 'error');
        });
    }
}

// Uploading geoJson from link to DB
function uploadjsonlink() {
    // URL from input
    var url = $("#jsonlink").val();
    if (url == "") {
        // JSNLog
        logger.info("No URL");
        sweetAlert('Oops...', 'You need to enter an URL!', 'error');
    } else {
        // Get json from link
        data = $.getJSON(url, function (data) {
            // JSNLog
            logger.info(data);

            errors = geojsonhint.hint(data);
            logger.info("Errors:");
            logger.info(errors);

            if (errors === undefined || errors.length == 0) {

                // From my post
                var namearray = [];
                var name = $("#jsonname").val();

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

                                // Add a name to the layer
                                data.name = name;

                                var properties = {
                                    popupContent: "<h2>" + name + "</h2><hr><img style='max-width:200px;max-height:100%;' src=" + bild + "><p style='font-size: 14px;'>" + text + "</p>"
                                };

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

            } else {
                sweetAlert('Oops...', 'There is something wrong with with this GeoJSON!', 'error');
                // JSNLog
                logger.info('Error in GeoJSON!');
            }

        }).error(function () {
            sweetAlert('Oops...', 'There is something wrong with the URL!', 'error');
        });
    }
}


// Importing geoJson from text to geojsonLayer
function importjsontext() {
    if ($("#jsontext").val() == "") {
        // JSNLog
        logger.info("No URL");
        sweetAlert('Oops...', 'You need to enter a GeoJSON text!', 'error');
    } else {
        // URL from input
        data = JSON.parse($("#jsontext").val());
        errors = geojsonhint.hint(data);
        logger.info("Errors:");
        logger.info(errors);

        if (errors === undefined || errors.length == 0) {

            geojsonLayer.addData(data);
            // JSNLog
            logger.info('GeoJSON added to layer!');
        } else {
            sweetAlert('Oops...', 'There is something wrong with with this GeoJSON!', 'error');
            // JSNLog
            logger.info('Error in GeoJSON!');
        }
    }
}


// Uploading geoJson from text to DB
function uploadjsontext() {
    if ($("#jsontext").val() == "") {
        // JSNLog
        logger.info("No URL");
        sweetAlert('Oops...', 'You need to enter a GeoJSON text!', 'error');
    } else {
        // URL from input
        data = JSON.parse($("#jsontext").val());
        errors = geojsonhint.hint(data);
        logger.info("Errors:");
        logger.info(errors);

        if (errors === undefined || errors.length == 0) {

            // From my post
            var namearray = [];
            var name = $("#jsonname").val();

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

                            // Add a name to the layer
                            data.name = name;

                            var properties = {
                                popupContent: "<h2>" + name + "</h2><hr><img style='max-width:200px;max-height:100%;' src=" + bild + "><p style='font-size: 14px;'>" + text + "</p>"
                            };

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
        } else {
            sweetAlert('Oops...', 'There is something wrong with with this GeoJSON!', 'error');
            // JSNLog
            logger.info('Error in GeoJSON!');
        }
    }
}


// Importing geoJson from file to geojsonLayer
function importjsonfile() {
    // Reader from input
    var reader = new FileReader();

    reader.readAsText(event.target.files[0]);
    reader.onload = function (event) {
        data = JSON.parse(event.target.result);
        errors = geojsonhint.hint(data);
        logger.info("Errors:");
        logger.info(errors);

        if (errors === undefined || errors.length == 0) {
            geojsonLayer.addData(data);
            // JSNLog
            logger.info('GeoJSON added to layer!');
        } else {
            sweetAlert('Oops...', 'There is something wrong with with this GeoJSON!', 'error');
            // JSNLog
            logger.info('Error in GeoJSON!');
        }
    }
};

// Uploading geoJson from file to DB
function uploadjsonfile() {
    // Reader from input
    var reader = new FileReader();

    reader.readAsText(event.target.files[0]);
    reader.onload = function (event) {
        data = JSON.parse(event.target.result);
        errors = geojsonhint.hint(data);
        logger.info("Errors:");
        logger.info(errors);


        if (errors === undefined || errors.length == 0) {
            // From my post
            var namearray = [];
            var name = $("#jsonname").val();

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

                            // Add a name to the layer
                            data.name = name;

                            var properties = {
                                popupContent: "<h2>" + name + "</h2><hr><img style='max-width:200px;max-height:100%;' src=" + bild + "><p style='font-size: 14px;'>" + text + "</p>"
                            };

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
        } else {
            sweetAlert('Oops...', 'There is something wrong with with this GeoJSON!', 'error');
            // JSNLog
            logger.info('Error in GeoJSON!');
        }
    }
}