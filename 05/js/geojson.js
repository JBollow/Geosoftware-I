/**
 * authors: Jan-Patrick Bollow 349891, Anna Formaniuk 427493, Jens Seifert 408076
 * 
 */

'use strict';

function geoJsonLink() {
    // getting the link from the textinput
    var link = $("#jsonLink").val();

    // pushing the linked geojson to the map
    map.data.loadGeoJson(link);

    // setting a style for the GeoJson
    map.data.setStyle({
        fillOpacity: 0.5,
        strokeColor: '#336633',
        strokeWeight: 2,
    })
};