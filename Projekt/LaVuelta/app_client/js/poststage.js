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
function uploadstage() {
    // Reader from input
    var reader = new FileReader();

    reader.readAsText(event.target.files[0]);
    reader.onload = function (event) {
        data = event.target.result;
        // Parse data to object
        var object = JSON.parse(data);
        var namearray = [];

        var name = object.stage[0];

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
                logger.info(namearray);

                if ($.inArray(name, namearray) == -1) {


                    // Use array in object.stage
                    var array = object.stage;
                    var stagename = array[0];

                    var senddata = data;

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
                            swal("Success!", stagename + " added to FeatureDB", "success")
                            getstage()
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
                    sweetAlert('A stage with this name is already in the DB!', 'Please make sure it is not already loaded.', 'error');
                }

            }
        });
    }
};