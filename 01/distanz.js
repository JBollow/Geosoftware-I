/**
 * Created by Jan_P on 24.04.2017.
 *
 * Geosoftware 1 SS17
 * Aufgabe 01
 *
 * @author Jan-Patrick Bollow 349891
 *
 */

/**
 * javascript getDistanz() zum Berechnen der Distanz zweier Punkte
 *
 */

function getDistanz() {

    /**
     * Einlesen aller Variablen
     * Latitude und Longitude von beiden Punkten
     *
     * Die Berechnung erfolgt nach dem Beispiel von: https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
     * Angepasst an meine Variablen und etwas gekürzt, der Radius ändert sich hoffentlich nicht so bald
     *
     */
    var lat1 = document.getElementById("lat1").value;
    var lon1 = document.getElementById("lon1").value;
    var lat2 = document.getElementById("lat2").value;
    var lon2 = document.getElementById("lon2").value;

    // Differenz beider Breiten-und Längengrade in Radiant
    var dLat = inRad(lat2 - lat1);
    var dLon = inRad(lon2 - lon1);

    // Performance!
    var dLat2 = Math.sin(dLat / 2);
    var dLon2 = Math.sin(dLon / 2);

    // a = sin(dLat/2)² + cos(lat1) * cos(lat2) * sin(dLon/2)²
    var a = dLat2*dLat2 + Math.cos(inRad(lat1)) * Math.cos(inRad(lat2)) * dLon2*dLon2;

    // c = 2 * arctan( sqrt(a) , sqrt(1-a) )
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // d = Distanz in km
    var d = 6371 * c;

    document.getElementById("dist").innerHTML = d + " km";

}

/**
 * Hilfsfunktion um Grad in Radiant umzurechnen
 */
function inRad(deg) {
    return deg * (Math.PI / 180)
}

