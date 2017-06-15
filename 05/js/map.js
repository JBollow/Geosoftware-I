/**
 * authors: Jan-Patrick Bollow 349891, Anna Formaniuk 427493, Jens
 * 
 */

'use strict';

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

    // Jens Marker Infotext
    var contentString = '<div id="content">' +
        '<div id="siteNotice">' +
        '</div>' +
        '<h1 id="firstHeading" class="firstHeading">Jens</h1>' +
        '<div id="bodyContent">' + '<image class="icon" src="https://camo.githubusercontent.com/7e97b9c10423e06bf6f91e971d8a9cec5926adfe/68747470733a2f2f63646e2e776f726c64766563746f726c6f676f2e636f6d2f6c6f676f732f6373732d332e737667"></image>' + '<br><p>Tolles Bild!</p>' +
        '</div>' +
        '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    // Marker Icons
    var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
    var icons = {
        library: {
            icon: iconBase + 'library_maps.png'
        }
    };

    // Jens Marker
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(51.938548, 7.591214),
        icon: icons['library'].icon,
        map: map,
        title: 'Jens'
    });

    // Popup on click
    marker.addListener('click', function () {
        infowindow.open(map, marker);
    });

    // OSM Basemap
    map.mapTypes.set('OSM', osmMapType);
    map.setMapTypeId('OSM');

    //JSNLog
    logger.info("Map initialized");

}