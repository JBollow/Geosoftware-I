/**
 * Geosoftware I, SoSe 2017, Aufgabe 1
 * @author Eric Thieme (429603), Christoph Friedrich (428065)
 */ 

/**
 * Gets data from input fields, passes it to the real calculation function, rounds the result and writes it into the output field
 */ 
function calc() {
  // write to output field
  document.getElementById('distanz').value = 
    // round the result
    Math.round(
      // get values and pass it to real calculation function
      getDistanceFromLatLonInKm(
        document.getElementById('lat1').value,
        document.getElementById('lon1').value,
        document.getElementById('lat2').value,
        document.getElementById('lon2').value
      // round to two decimal places
      ) * 100) / 100
    // add unit
    + ' km';
}

/**
 * Calculates distance between two points.
 * @author Chuck @ StackOverflow.com
 * @see http://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
 */ 
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

/**
 * Helper function for getDistanceFromLatLonInKm
 */
function deg2rad(deg) {
  return deg * (Math.PI/180);
}