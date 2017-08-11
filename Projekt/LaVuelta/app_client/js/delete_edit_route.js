/**
 *  @author Jan-Patrick Bollow 349891
 */

// Delete all routes
function deleteallroute() {
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/getroute",
        success: function (response) {
            logger.info(response);
            if (response.length == 0) {
                sweetAlert('Oops...', 'There are no routes to delete!', 'error');
            } else {
                swal({
                        title: "Delete all routes?",
                        text: "To delete all routes write 'delete routes':",
                        type: "input",
                        showCancelButton: true,
                        closeOnConfirm: false,
                        animation: "slide-from-top",
                        inputPlaceholder: "Write something"
                    },
                    function (inputValue) {
                        if (inputValue === false) return false;
                        if (inputValue === "delete routes") {
                            swal("Routes deleted!", "All routes were deleted from the DB");

                            $.ajax({
                                type: "GET",
                                url: "http://localhost:3000/deleteallroute",
                                success: function () {
                                    // JSNLog
                                    logger.info('Delete successful!');
                                    $('#jsonname').val('');
                                    logger.info("bam");
                                    logger.info("http://localhost:3000/deleteallroute/");
                                },
                                error: function () {
                                    sweetAlert('Oops...', 'Something went wrong!', 'error');
                                    // JSNLog
                                    logger.error('Failed!');
                                }
                            }).error(function () {
                                sweetAlert('Oops...', 'Something went wrong!', 'error');
                                // JSNLog
                                logger.error('Failed!');
                            });
                            removeroute();
                            return true
                        } else {
                            swal.showInputError("You need to write 'delete routes' to delete all routes");
                            return false
                        }
                    });
            }
        },
        error: function (responsedata) {
            sweetAlert('Oops...', 'Something went wrong!', 'error');
            // JSNLog
            logger.error('Failed in!');
        }
    }).error(function (responsedata) {
        // JSNLog
        logger.error('Failed out!');
    });
}

// Delete route function
function deleteroute(clicked_id) {
    swal({
            title: "Delete this route?",
            text: "You will not be able to recover it!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel plx!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function (isConfirm) {
            if (isConfirm) {
                swal("Deleted!", "Your route has been deleted.", "success");

                $.ajax({
                    type: "GET",
                    url: "http://localhost:3000/deleteroute/" + clicked_id,
                    success: function () {
                        // JSNLog
                        logger.info('Delete successful!');
                        $('#jsonname').val('');
                    },
                    error: function () {
                        sweetAlert('Oops...', 'Something went wrong!', 'error');
                        // JSNLog
                        logger.error('Failed!');
                    }
                }).error(function () {
                    sweetAlert('Oops...', 'Something went wrong!', 'error');
                    // JSNLog
                    logger.error('Failed!');
                });
                $("#legendelem").empty();
                getroute();
            } else {
                swal("Cancelled", "Your route is safe :)", "error");
            }
        });
}

// Delete route function
function editroute(clicked_id) {
    swal({
            title: "Override this route?",
            text: "The original will be overwritten!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, overwrite it!",
            cancelButtonText: "No, cancel plx!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function (isConfirm) {
            if (isConfirm) {
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
                                logger.info('Get successful!');
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
                                        },
                                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                                            sweetAlert('Oops...', 'Something went wrong!', 'error');
                                            // JSNLog
                                            logger.error("Posting failed!");
                                        },
                                        timeout: 3000
                                    });
                                    $.ajax({
                                        type: "GET",
                                        url: "http://localhost:3000/deleteroute/" + clicked_id,
                                        success: function () {
                                            // JSNLog
                                            logger.info('Delete successful!');
                                            $("#legendelem").empty();
                                            getroute();
                                        },
                                        error: function () {
                                            sweetAlert('Oops...', 'Something went wrong!', 'error');
                                            // JSNLog
                                            logger.error('Failed!');
                                        }
                                    }).error(function () {
                                        sweetAlert('Oops...', 'Something went wrong!', 'error');
                                        // JSNLog
                                        logger.error('Failed!');
                                    });
                                } else {
                                    $.ajax({
                                        type: 'GET',
                                        url: 'http://localhost:3000/getroute',
                                        success: function (response) {
                                            response.forEach(function (entry) {
                                                logger.info("entry");
                                                logger.info(entry._id);
                                                logger.info(entry.geojson.routeName);
                                                
                                                if (entry._id == clicked_id) {
                                                    if (entry.geojson.routeName == name) {
                                                        // Delete
                                                        $.ajax({
                                                            type: "GET",
                                                            url: "http://localhost:3000/deleteroute/" + clicked_id,
                                                            success: function () {
                                                                // JSNLog
                                                                logger.info('Delete successful!');
                                                            },
                                                            error: function () {
                                                                sweetAlert('Oops...', 'Something went wrong!', 'error');
                                                                // JSNLog
                                                                logger.error('Failed!');
                                                            }
                                                        }).error(function () {
                                                            sweetAlert('Oops...', 'Something went wrong!', 'error');
                                                            // JSNLog
                                                            logger.error('Failed!');
                                                        });
                                                        // Overwrite
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
                            },
                            error: function (responsedata) {
                                sweetAlert('Oops...', 'Something went wrong!', 'error');
                                // JSNLog
                                logger.error('Failed in!');
                            },
                            timeout: 3000
                        }).error(function (responsedata) {
                            sweetAlert('Oops...', 'Something went wrong!', 'error');
                            // JSNLog
                            logger.error('Failed out!');
                        });
                    } else {
                        // JSNLog
                        logger.error('No name', name);
                        sweetAlert('No routeename!', 'Please name your route.', 'error');
                    }
                }
            } else {
                swal("Cancelled", "Your route is safe :)", "error");
            }
        });
}

// JSNLog
logger.info("delete_edit_route loaded");