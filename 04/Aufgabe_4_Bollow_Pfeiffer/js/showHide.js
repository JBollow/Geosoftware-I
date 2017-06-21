//Philipp Pfeiffer: 421620
//Jan-Patrick Bollow: 349891 

"use strict";
// Function for displaying the map element in three seconds
function blendeEin() {
    if (linienGeojsonFeature == null) {
        alert("Bitte waehle zum Anzeigen des Polygons eine Datei mit gueltigen Koordinaten aus.");
        $("#map").fadeIn(3000);
    } else {
        $("#map").fadeIn(3000);
    }
}

// Function for hiding the map element in three seconds
function blendeAus() {
    $("#map").fadeOut(3000);
}