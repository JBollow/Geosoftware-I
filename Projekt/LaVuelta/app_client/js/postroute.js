/**
 *  @author Jan-Patrick Bollow 349891
 */

// Post the route to DB as route
function postroute() {

    if (control.getWaypoints()[1].latLng == null) {
        // JSNLog
        logger.error('No route', );
        sweetAlert('No route!', 'Please make a route first', 'error');

    } else {
        var namearray = [];
        var name = $("#jsonname").val();

        // JSNLog
        logger.info('Name is!');
        logger.info(name);

        if (name != "") {


            // Get all GeoJSON names from our DB using our GET
            $.ajax({
                type: "GET",
                url: "http://localhost:3000/getroute",
                success: function (response) {
                    // JSNLog
                    logger.info('Get successful!', response);

                    // Using a forEach method iterating over the array of nested objects
                    response.forEach(function (entry) {
                        namearray.push(entry.geojson.routeName);
                    });

                    // JSNLog
                    logger.info(namearray);

                    if ($.inArray(name, namearray) == -1) {
                        // JSNLog
                        logger.info(control.getWaypoints());

                        var JSONtoPOST = {
                            "costing": $('#transport').val(),
                            "language": $('#language').val(),
                            "routeName": $("#jsonname").val(),
                            "navigationPoints": control.getWaypoints(),
                        };

                        // JSNLog
                        logger.info(JSONtoPOST);

                        // Post to local mongodb via nodejs using our own POST
                        $.ajax({
                            type: "POST",
                            url: "http://localhost:3000/postroute",
                            dataType: 'json',
                            contentType: 'application/json',
                            data: JSON.stringify(JSONtoPOST),
                            traditional: true,
                            cache: false,
                            processData: false,
                            success: function () {
                                swal("Success!", $("#jsonname").val() + " added to RouteDB", "success")
                                // JSNLog
                                logger.info("Post successful!");
                                getroute();
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
                        sweetAlert('Routeename already in use!', 'Please use another name for your route.', 'error');
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
            sweetAlert('No routeename!', 'Please name your route.', 'error');
        }
    }
};