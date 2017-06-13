/**
 * authors: Jan-Patrick Bollow, 349891#
 * 
 */

// Findind my location
function initPosition() {

    navigator.geolocation.getCurrentPosition(

        // Output text + moveto button
        function (position) {
            document.getElementById('pos').innerHTML = '<p>Latitude: ' + position.coords.latitude + '/ Longitude: ' + position.coords.longitude + '&nbsp;&nbsp;<input id="clickMe" type="button" class="button" value="Jump to my location" onclick="moveToLocation(' + position.coords.latitude + "," + position.coords.longitude + ')"/>';

            //JSNLog
            logger.info("Location found");
        },

        function () {
            document.getElementById('pos').innerHTML = 'Your location was not found';

            //JSNLog
            logger.error("Location not found");
        });

}

// Move to my location
function moveToLocation(lat, lng) {
    var center = new google.maps.LatLng(lat, lng);
    // using global variable:
    map.panTo(center);

    //JSNLog
    logger.info("Moved to my location");
}