/**
 *  @author Jan-Patrick Bollow 349891
 */

'use strict';

// Get the route from DB 
function getrouteshort() {

    // clearLayers before adding to prevent duplicates
    $("#legendelem").empty();

    // Get all GeoJSON from our DB using our GET
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/getroute",
        success: function (response) {

            // JSNLog
            logger.info('Get successful!');

            if (response.length == 0) {
                $("#legendelem").empty();
                $('#legend').hide();
                $("#legenddiv").hide();
                $("#legendbtndiv").hide();

            } else {
                // Using a forEach method iterating over the array of nested objects
                response.forEach(function (entry) {

                    // Ich habe ein Monster erschaffen, sorry, aber das war die Lösung die ich schon lange im Kopf hatte
                    $('#legendelem').append("<li style='height: 30px;width: 100%;'><p style='font-size: 14px;display: inline;'><input name='routes' type='radio' id='" + entry._id + "' onchange='routeselector(this.id)'> " + entry.geojson.routeName + "</p></li>");
                });
                // Adding a legend + removebutton
                $('#legend').show();
                $("#legenddiv").show();
                $("#legendbtndiv").show();
                $('#legend').replaceWith("<h3>Routes:</h3>");
                $('#legendbtn').replaceWith("<input style='width: 100%;' type='button' class='button' value='&#x21bb; Remove all routes' onclick='removeroute();control.hide();'>");
            }
        },

        error: function (responsedata) {

            // If something fails, cleaning the legend and jsonlayers

            $("#legendelem").empty();
            $("#legenddiv").hide();
            $('#legend').hide();
            $("#legendbtndiv").hide();
            sweetAlert('Oops...', 'Something went wrong!', 'error');
            // JSNLog
            logger.error('Failed in!' + response);
        }
    }).error(function (responsedata) {

        // If something fails, cleaning the legend and jsonlayers

        $("#legendelem").empty();
        $("#legenddiv").hide();
        $("#legendbtndiv").hide();
        $('#legend').hide();
        sweetAlert('Oops...', 'Something went wrong!', 'error');
        // JSNLog
        logger.error('Failed out!' + response);
    });
};

// Selects the routes with checkboxes
function routeselector(clicked_id) {
    if ($("#" + clicked_id).is(':checked')) {
        control.show();
        $('#checkroute').prop('checked', true);
        control.getPlan().setWaypoints({
            latLng: L.latLng([null])
        });
        $.ajax({
            type: 'GET',
            url: 'http://localhost:3000/getroute',
            success: function (response) {
                response.forEach(function (entry) {
                    if (entry._id == clicked_id) {
                        control.remove();
                        reloadControl(entry.geojson.language, entry.geojson.costing);
                        $('#transport').val(entry.geojson.costing);
                        $('#language').val(entry.geojson.language);
                        control.setWaypoints(entry.geojson.navigationPoints);
                        $('#jsonname').val(entry.geojson.routeName);
                    }
                });
            },
            timeout: 3000,
            error: function (responsedata) {
                control.getPlan().setWaypoints({
                    latLng: L.latLng([null])
                });
                sweetAlert('Oops...', 'Something went wrong!', 'error');
            }
        }).error(function (responsedata) {
            control.getPlan().setWaypoints({
                latLng: L.latLng([null])
            });
            sweetAlert('Oops...', 'Something went wrong!', 'error');
        });
    }
    logger.info('Changed route');
}