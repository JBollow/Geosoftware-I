//Philipp Pfeiffer: 421620
//Jan-Patrick Bollow: 349891 
"use strict";

// Init the map
var map;
var marker1;
var marker2;
var controls;
var myLayer;

// Create a Icon for the EndPopUP
var redIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
// Create a Icon for the StartPopUP
var greenIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Remove the old Map and create a new
if (map !== undefined) {
    console.log("map ist :" + map);
    map.remove()
}
map = L.map('map').setView([51.96, 7.61], 13);

// Add an OpenStreetMap base map
var osmLayer = new L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});
osmLayer.addTo(map);

// Create a second base map
var osmLayer2 = new L.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});
// Create a second base map
var osmLayer3 = new L.tileLayer('http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});


var baseMaps = {
    "OpenStreetMap": osmLayer,
    "toner": osmLayer2,
    "Watercolor": osmLayer3
};

//Layer control function
controls = L.control.layers(baseMaps).addTo(map);
JL().info("Map ready");


/**
 * Function creating the map.
 * @param event
 */
var leaflet = function (event) {

    // Add a geojson to Map

    if (myLayer !== undefined) {

        map.removeLayer(myLayer);
        console.log("remove layer")
    }

    myLayer = L.geoJson().addTo(map);

    myLayer.addData(linienGeojsonFeature);



    var overlayMaps = {
        "Line": myLayer
    };

    // remove the layercontroler and set a new with a new layer "line"
    if (controls !== undefined) {

        controls.remove();
        controls = L.control.layers(baseMaps, overlayMaps).addTo(map);
        controls.addTo(map);
    }

    //Layer control function
    JL().info("Map ready");

}


//by click on the Map-Navigation-Tool set PopUps Markers for the Line
document.getElementById('map-navigation').onclick = function (e) {
    var lineNr = parseInt(e.target.getAttribute('line-nr')) + 1;
    var posStart = e.target.getAttribute('data-position-start');
    var posEnde = e.target.getAttribute('data-position-ende');

    if (posStart && posEnde) {
        posStart = posStart.split(',');
        posEnde = posEnde.split(',');

        if (marker1 !== undefined) {
            map.removeLayer(marker1)
            map.removeLayer(marker2)
        }

        marker1 = L.marker(posStart, {
            icon: greenIcon
        })
        marker2 = L.marker(posEnde, {
            icon: redIcon
        })

        map.addLayer(marker1).addLayer(marker2);
        marker2.bindPopup("<b>Hello!</b><br>I am the Endpoint from line " + lineNr + " .").openPopup();
        marker1.bindPopup("<b>Hello!</b><br>I am the Startpoint from line" + lineNr + " .").openPopup();

        map.fitBounds([
            [posStart],
            [posEnde]
        ], {
            animate: true
        });
        return false;

    }
}