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
var group = [];
var errors, data;

// Importing stage from file to stages
function uploadstage(event) {
    // Reader from input
    var reader = new FileReader();

    reader.readAsText(event.target.files[0]);
    reader.onload = function (event) {
        data = event.target.result;
        // Parse data to object
        var object = JSON.parse(data);

        var namearray = [];
        var name = object.geojson.stage[0];

        $.ajax({
            type: "GET",
            url: "http://localhost:3000/getstage",
            success: function (response) {
                // JSNLog
                logger.info('Get successful!', response);

                // Using a forEach method iterating over the array of nested objects
                response.forEach(function (entry) {
                    var array = entry.geojson.stage;
                    var stagename = array[0];
                    namearray.push(stagename);
                });

                // JSNLog
                logger.info("namearray");
                logger.info(namearray);

                if ($.inArray(name, namearray) == -1) {


                    // Use array in object.stage
                    var array = object.geojson.stage;
                    var stagename = array[0];

                    var senddata = data;
                    poststagesa(array, name);

                } else {
                    // JSNLog
                    logger.error('Name already in use!', name);
                    sweetAlert('A stage with this name is already in the DB!', 'Please make sure it is not already loaded.', 'error');
                }

            }
        });
    }
};

// Post stage standalone
function poststagesa(array, name) {
    // Stagename
    array[0] = name;

    // Start picture
    array[1] = $("#jsonbild").val();
    // Start urlname
    array[2] = $("#jsonweblinknamestart").val();
    // Start url
    array[3] = $("#jsonweblinkstart").val();
    // Start date
    array[4] = $("#jsonstarttime").val();
    // Start text
    array[5] = $("#jsonpopuptextstart").val();

    // End picture
    array[6] = $("#jsonbildend").val();
    // End urlname
    array[7] = $("#jsonweblinknameend").val();
    // End url
    array[8] = $("#jsonweblinkend").val();
    // End date
    array[9] = $("#jsonstarttimeend").val();
    // End text
    array[10] = $("#jsonpopuptextend").val();

    // Start&EndName
    array[11] = $("#jsonstartname").val();
    array[12] = $("#jsonendname").val();

    // Adding selected features to stage
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/getjson",
        success: function (response) {
            // JSNLog
            logger.info('Get successful!', response);

            if (response.length == 0) {
                sweetAlert('Oops...', 'Something went wrong!', 'error');
            } else {
                response.forEach(function (entry) {
                    var id = entry._id;
                    // Adds a feature to the stage, if it's checkbox is checked
                    if ($('#' + id).is(":checked")) {
                        array.push(entry);
                    }
                });
            }

            var data = {
                "stage": array
            };
            var senddata = JSON.stringify(data);

            // JSNLog
            logger.info("senddata");
            logger.info(senddata);

            // Post to local mongodb
            $.ajax({
                type: "POST",
                url: "http://localhost:3000/poststage",
                dataType: 'json',
                contentType: 'application/json',
                data: senddata,
                traditional: true,
                cache: false,
                processData: false,
                success: function () {
                    swal("Success!", name + " added to FeatureDB", "success")
                    getstage();
                    // JSNLog
                    logger.info("Post successful!");
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    sweetAlert('Oops...', 'Something went wrong! It might be too big.', 'error');
                    // JSNLog
                    logger.error("Posting failed!");
                },
                timeout: 3000

            });
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
};

// Post stage from stage editor
function poststage() {

    var namearray = [];
    var name = $("#jsonname").val();

    // JSNLog
    logger.info('Name is!');
    logger.info(name);

    if (name != "") {

        // Get all GeoJSON names from our DB using our GET
        $.ajax({
            type: "GET",
            url: "http://localhost:3000/getstage",
            success: function (response) {
                // JSNLog
                logger.info('Get successful!', response);

                // Using a forEach method iterating over the array of nested objects
                response.forEach(function (entry) {
                    var array = entry.geojson.stage;
                    var stagename = array[0];
                    namearray.push(stagename);
                });

                // JSNLog
                logger.info("namearray");
                logger.info(namearray);

                if ($.inArray(name, namearray) == -1) {

                    var array = [];

                    poststagesa(array, name);

                } else {
                    // JSNLog
                    logger.error('Name already in use!', name);
                    sweetAlert('A stage with this name is already in the DB!', 'Please make sure it is not already loaded.', 'error');
                }

            }
        });

    } else {
        // JSNLog
        logger.error('No name', name);
        sweetAlert('No stagename!', 'Please name your stage.', 'error');
    }

};

// Exports stage from stage editor to file
document.getElementById('exportstage').onclick = function (e) {

    var name = $("#jsonname").val();
    var array = [];
    var convertedData;

    // Stagename
    array[0] = name;

    // Start picture
    array[1] = $("#jsonbild").val();
    // Start urlname
    array[2] = $("#jsonweblinknamestart").val();
    // Start url
    array[3] = $("#jsonweblinkstart").val();
    // Start date
    array[4] = $("#jsonstarttime").val();
    // Start text
    array[5] = $("#jsonpopuptextstart").val();

    // End picture
    array[6] = $("#jsonbildend").val();
    // End urlname
    array[7] = $("#jsonweblinknameend").val();
    // End url
    array[8] = $("#jsonweblinkend").val();
    // End date
    array[9] = $("#jsonstarttimeend").val();
    // End text
    array[10] = $("#jsonpopuptextend").val();

    // Start&EndName
    array[11] = $("#jsonstartname").val();
    array[12] = $("#jsonendname").val();

    // Adding selected features to stage
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/getjson",
        success: function (response) {
            // JSNLog
            logger.info('Get successful!', response);

            if (response.length == 0) {
                sweetAlert('Oops...', 'Something went wrong!', 'error');
            } else {
                response.forEach(function (entry) {
                    var id = entry._id;
                    // Adds a feature to the stage, if it's checkbox is checked
                    if ($('#' + id).is(":checked")) {
                        array.push(entry);
                    }
                });
            }

            var data = {
                "stage": array
            };

            // Stringify the GeoJson
            convertedData = JSON.stringify(data);

            // JSNLog
            logger.info("convertedData");
            logger.info(convertedData);

            // Create export
            document.getElementById('exportstage').setAttribute('href', 'data:' + convertedData);
            document.getElementById('exportstage').setAttribute('download', 'stage.json');

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


};

// Refresh Start
function refreshstart() {
    $("#jsonstartname").val('');
    $("#jsonbild").val('');
    $("#jsonweblinknamestart").val('');
    $("#jsonweblinkstart").val('');
    $("#jsonstarttime").val('');
    $("#jsonpopuptextstart").val('');
}

// Refresh End
function refreshend() {
    $("#jsonendname").val('');
    $("#jsonbildend").val('');
    $("#jsonweblinknameend").val('');
    $("#jsonweblinkend").val('');
    $("#jsonstarttimeend").val('');
    $("#jsonpopuptextend").val('');
}