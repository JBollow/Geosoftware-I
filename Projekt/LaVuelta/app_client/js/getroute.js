/**
 *  @author Jan-Patrick Bollow 349891
 */

'use strict';

// Get the route from DB 
function getroute() {

    // clearLayers before adding to prevent duplicates
    $("#legendelem").empty();
    $('#jsonname').removeAttr('value');

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
                    $('#legendelem').append("<li style='height: 30px;width: 100%;'><div class='title'><p style='font-size: 14px;display: inline;'><input name='routes' type='radio' id='" + entry._id + "' onchange='routeselector(this.id)'> " + entry.geojson.routeName + "</p></div><div class='content'><button class='delbutton' type='button' id='" + entry._id + "' onclick='editroute(this.id)'><i class='fa fa-pencil' aria-hidden='true'></i></button><button class='delbutton' type='button' id='" + entry._id + "' onclick='deleteroute(this.id)'><i class='fa fa-trash' aria-hidden='true'></i></button></div></li>");
                });
                // Adding a legend + removebutton
                $("#legenddiv").show();
                $("#legendbtndiv").show();
                $('#legend').show();
                $('#legend').replaceWith("<h3>Routes:</h3>");
                $('#legendbtn').replaceWith("<table class='cleantable' style='width: 100%; padding: 0px;'><tr><td style='width: 50%;padding: 0px;'><button style='margin: 0px;width: 100%;' type='button' class='button jsonupbtn' value='' onclick='removeroute();'>&#x21bb; Remove all routes</button></td><td style='width: 50%;padding: 0px;'><button style='margin-left: 1px;width: 100%;' type='button' class='buttondel jsonupbtn' value='' id='deleteroutedb' style='width: 100%;'onclick='deleteallroute()'><i class='fa fa-trash' aria-hidden='true'></i> Delete all routes</button></td></tr></table>");
            }
        },

        error: function (responsedata) {

            // If something fails, cleaning the legend and jsonlayers

            $("#legendelem").empty();
            $('#legend').hide();
            $("#legenddiv").hide();
            $("#legendbtndiv").hide();
            sweetAlert('Oops...', 'Something went wrong!', 'error');
            // JSNLog
            logger.error('Failed in!' + response);
        }
    }).error(function (responsedata) {

        // If something fails, cleaning the legend and jsonlayers

        $("#legendelem").empty();
        $("#legenddiv").hide();
        $('#legend').hide();
        $("#legendbtndiv").hide();
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
                        $('#jsonname').attr('value', entry.geojson.routeName);
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