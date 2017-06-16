/**
 * authors: Jan-Patrick Bollow 349891, Anna Formaniuk 427493, Jens
 * 
 */

'use strict';

// Findind my location
function initPosition() {

    navigator.geolocation.getCurrentPosition(

        // Output text + moveto button
        function (position) {
            document.getElementById('positionbox').innerHTML = '<table class="cleantable"><tr><td>Latitude:</td><td>' + Math.round(position.coords.latitude * 10000) / 10000 + '</td></tr><td>Longitude:</td><td>' + Math.round(position.coords.longitude * 10000) / 10000 + '</td></tr></table><br><input type="button" class="button" style="width: 100%;" value="Jump to my location" onclick="moveToLocation(' + position.coords.latitude + "," + position.coords.longitude + ')"/>';

            //JSNLog
            logger.info("Location found");
        },

        function () {
            document.getElementById('positionbox').innerHTML = '<p>Your location was not found</p>';

            //JSNLog
            logger.error("Location not found");
        }, {
            timeout: 10000
        }
    );

}

// Move to my location
function moveToLocation(lat, lng) {
    var center = new google.maps.LatLng(lat, lng);
    // using global variable:
    map.panTo(center);
    map.setZoom(16);

    //JSNLog
    logger.info("Moved to my location");
}