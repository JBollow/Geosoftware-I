/**
 *  @author Jan-Patrick Bollow 349891
 */

'use strict';

var errors;

// // Delete all stages
function deleteallstages() {
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/getstage",
        success: function (response) {
            if (response.length == 0) {
                sweetAlert('Oops...', 'There are no stages to delete!', 'error');
            } else {
                swal({
                        title: "Delete all stages?",
                        text: "To delete all stages write 'delete stages':",
                        type: "input",
                        showCancelButton: true,
                        closeOnConfirm: false,
                        animation: "slide-from-top",
                        inputPlaceholder: "Write something"
                    },
                    function (inputValue) {
                        if (inputValue === false) return false;
                        if (inputValue === "delete stages") {
                            swal("stages deleted!", "All stages were deleted from the DB");
                            $.ajax({
                                type: "GET",
                                url: "http://localhost:3000/deleteallstages",
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
                            removestage();
                            return true
                        } else {
                            swal.showInputError("You need to write 'delete stages' to delete all stages");
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

// Delete stages function
function deletestage(clicked_id) {
    swal({
            title: "Delete this stage?",
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
                swal("Deleted!", "Your stage has been deleted.", "success");
                $.ajax({
                    type: "GET",
                    url: "http://localhost:3000/deletestage/" + clicked_id,
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
                getstage();
            } else {
                swal("Cancelled", "Your stage is safe :)", "error");
            }
        });
}

// Delete stage function
function editstage(clicked_id) {
    swal({
            title: "Override this stage?",
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
                        url: "http://localhost:3000/getstage",
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

                                var array = [];

                                poststagesa(array, name);

                                $.ajax({
                                    type: "GET",
                                    url: "http://localhost:3000/deletestage/" + clicked_id,
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
                                    url: 'http://localhost:3000/getstage',
                                    success: function (response) {
                                        response.forEach(function (entry) {
                                            logger.info("entry");
                                            logger.info(entry);
                                            logger.info(entry.geojson.name);
                                            if (entry._id == clicked_id) {
                                                if (entry.geojson.name == name) {
                                                    // Extract GeoJson from editableLayer
                                                    var array = [];

                                                    poststagesa(array, name);

                                                } else {
                                                    // JSNLog
                                                    logger.error('Name already in use!', name);
                                                    sweetAlert('Stageename already in use!', 'Please use another name for your stage.', 'error');
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
                    sweetAlert('No stagename!', 'Please name your stage.', 'error');
                }



            } else {
                swal("Cancelled", "Your stage is safe :)", "error");
            }
        });
}

// JSNLog
logger.info("delete_edit_stage loaded");