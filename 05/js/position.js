/**
 * authors: Jan-Patrick Bollow, 349891#
 * 
 */

// Findind my location
function initPosition() {

    navigator.geolocation.getCurrentPosition(

        // Output text + moveto button
        function (position) {
            document.getElementById('positionbox').innerHTML = '<p>Latitude: ' + Math.round(position.coords.latitude * 10000) / 10000 + '<br>Longitude: ' + Math.round(position.coords.longitude * 10000) / 10000 + '<br><input type="button" class="button" style="width: 100%;" value="Jump to my location" onclick="moveToLocation(' + position.coords.latitude + "," + position.coords.longitude + ')"/>';

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