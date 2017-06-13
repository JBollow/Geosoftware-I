/**
 * authors: Jan-Patrick Bollow, 349891#
 * 
 */

// Findind my location
function initPosition() {

    navigator.geolocation.getCurrentPosition(

        // Output text + moveto button
        function (position) {
            document.getElementById('positionbox').innerHTML = '<p>Latitude: ' + Math.round(position.coords.latitude * 10000) / 10000 + '&nbsp;&#x2194;&nbsp;Longitude: ' + Math.round(position.coords.longitude * 10000) / 10000 + '&nbsp;&nbsp;<input type="button" class="button" value="Jump to my location" onclick="moveToLocation(' + position.coords.latitude + "," + position.coords.longitude + ')"/>';

            //JSNLog
            logger.info("Location found");
        },

        function () {
            document.getElementById('positionbox').innerHTML = '<p>Your location was not found</p>';

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