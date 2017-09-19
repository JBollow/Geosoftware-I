/**
 *  @author Jan-Patrick Bollow 349891
 */

'use strict';

var errors;

// Delete all features
function deleteallfeature() {
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/getjson",
        success: function (response) {
            if (response.length == 0) {
                sweetAlert('Oops...', 'There are no features to delete!', 'error');
            } else {
                swal({
                        title: "Delete all features?",
                        text: "To delete all features write 'delete features':",
                        type: "input",
                        showCancelButton: true,
                        closeOnConfirm: false,
                        animation: "slide-from-top",
                        inputPlaceholder: "Write something"
                    },
                    function (inputValue) {
                        if (inputValue === false) return false;
                        if (inputValue === "delete features") {
                            swal("Features deleted!", "All features were deleted from the DB");
                            $.ajax({
                                type: "GET",
                                url: "http://localhost:3000/deletealljson",
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
                            removelayer();
                            return true
                        } else {
                            swal.showInputError("You need to write 'delete features' to delete all features");
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

// Delete features function
function deletefeature(clicked_id) {
    swal({
            title: "Delete this feature?",
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
                swal("Deleted!", "Your feature has been deleted.", "success");
                $.ajax({
                    type: "GET",
                    url: "http://localhost:3000/deletejson/" + clicked_id,
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
                $("#jsonlegendelem").empty();
                getjson();
            } else {
                swal("Cancelled", "Your feature is safe :)", "error");
            }
        });
}

// Delete feature function
function editfeature(clicked_id) {
    swal({
            title: "Override this feature?",
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

                var namearray = [];
                var name = $("#jsonname").val();

                // JSNLog
                logger.info('Name is!');
                logger.info(name);

                if (name != "") {
                    // Get all GeoJSON names from our DB using our GET
                    $.ajax({
                        type: "GET",
                        url: "http://localhost:3000/getjson",
                        success: function (response) {
                            // JSNLog
                            logger.info('Get successful!');

                            // Using a forEach method iterating over the array of nested objects
                            response.forEach(function (entry) {
                                namearray.push(entry.geojson.name);
                            });

                            // JSNLog
                            logger.info("namearray");
                            logger.info(namearray);
                            logger.info("name");
                            logger.info(name);

                            if ($.inArray(name, namearray) == -1) {
                                logger.info("bam");
                                // Extract GeoJson from editableLayer
                                var data = editableLayers.toGeoJSON();

                                postjsonsa(data);

                                $.ajax({
                                    type: "GET",
                                    url: "http://localhost:3000/deletejson/" + clicked_id,
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
                            } else {
                                $.ajax({
                                    type: 'GET',
                                    url: 'http://localhost:3000/getjson',
                                    success: function (response) {
                                        response.forEach(function (entry) {
                                            logger.info("entry");
                                            logger.info(entry);
                                            logger.info(entry.geojson.name);
                                            if (entry._id == clicked_id) {
                                                if (entry.geojson.name == name) {
                                                    // Extract GeoJson from editableLayer
                                                    var data = editableLayers.toGeoJSON();

                                                    errors = geojsonhint.hint(data);
                                                    logger.info("Errors:");
                                                    logger.info(errors);

                                                    if (errors === undefined || errors.length == 0) {

                                                        postjsonsa(data);

                                                        $.ajax({
                                                            type: "GET",
                                                            url: "http://localhost:3000/deletejson/" + clicked_id,
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

                                                    } else {
                                                        sweetAlert('Oops...', 'There is something wrong with with this GeoJSON!', 'error');
                                                        // JSNLog
                                                        logger.info('Error in GeoJSON!');
                                                    }

                                                } else {
                                                    // JSNLog
                                                    logger.error('Name already in use!', name);
                                                    sweetAlert('Featureename already in use!', 'Please use another name for your feature.', 'error');
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
                swal("Cancelled", "Your feature is safe :)", "error");
            }
        });
}

// JSNLog
logger.info("delete_edit_json loaded");