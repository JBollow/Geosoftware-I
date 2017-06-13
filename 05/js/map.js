/**
 * authors: Jan-Patrick Bollow, 349891#
 * 
 */

//I am using Google Maps API with an additional OSM basemap

var map;
// Start location muenster
var muenster = new google.maps.LatLng(51.960, 7.626);

//Define OSM as base layer in addition to the default Google layers
var osmMapType = new google.maps.ImageMapType({
    getTileUrl: function (coord, zoom) {
        return "http://tile.openstreetmap.org/" +
            zoom + "/" + coord.x + "/" + coord.y + ".png";
    },

    tileSize: new google.maps.Size(256, 256),
    isPng: true,
    alt: "OpenStreetMap",
    name: "OSM",
    maxZoom: 19

});

// Initializing the map with it's elements
function initMap() {

    var mapOptions = {
        zoom: 12,
        center: muenster,
        mapTypeId: 'OSM',
        mapTypeControlOptions: {
            mapTypeIds: ['OSM', google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.HYBRID, google.maps.MapTypeId.TERRAIN],
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        }
    };

    map = new google.maps.Map(document.getElementById("map"), mapOptions, GeoMarker);

    // Marker at myLocation
    var GeoMarker = new GeolocationMarker(map);

    map.mapTypes.set('OSM', osmMapType);
    map.setMapTypeId('OSM');

    //JSNLog
    logger.info("Map initialized");
}