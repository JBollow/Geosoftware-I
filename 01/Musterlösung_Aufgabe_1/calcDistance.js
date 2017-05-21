/**  
* @desc Calculates the distance between two points (long/lat) in kilometres
* @author Max Mustermann max.mustermann@uni-muenster.de 
*
*/
// Initialize two points
var point1_lat=51.955415;
var point1_long=7.626326;
var point2_lat=51.949609;
var point2_long=7.624550;

// Show calculated value
var elem = document.getElementById("distancevalue");
var example_coords_distance = GetDistance(point1_lat, point1_long, point2_lat, point2_long);
elem.innerHTML = "Point 1: "+point1_lat+", "+point1_long+"<br>";
elem.innerHTML += "Point 2: "+point2_lat+", "+point2_long+"<br>";
elem.innerHTML += "Distance: "+example_coords_distance+" km";


/*
* Calculate and display the distance between two input coordinates
* 
* @desc This function reads the Coordinates a user put into the HTML document from their respective input fields,
* 		and calls the GetDistance() function to calculate the distance between that pair.
* 		Then, the "inputCoordsDistanceOutput" Tag in the HTML file is appended by a String,
* 		containing the input Coordinates and the result of the calculation.
*/
function calculateDistanceFromInputCoords () {
	// get the input Coordinates
	var lat1 = document.getElementById("lat1").value;
	var lon1 = document.getElementById("lon1").value;
	var lat2 = document.getElementById("lat2").value;
	var lon2 = document.getElementById("lon2").value;
	
	// this builds a connection between the orinigal document´s Tag (from the DOM) with the id "inputCoordsDistanceOutput"
	// and the JavaScript, through the variable output. Changes to output are directly displayed in the Browser.
	var output = document.getElementById("inputCoordsDistanceOutput");
	
	// calculate the distance between the input coordinates using the GetDistance function
	var input_coords_distance = GetDistance(lat1, lon1, lat2, lon2);
	
	// appending the .innerHTML attribute of the output Tag, which is the area displayed on the page
	output.innerHTML = "Your input Coordinates where: <br>" + "<b>Lat:</b> " + lat1 + ", <b>Long:</b> " + lon1 + " <b>|| ||  Lat: </b>" + lat2 + ", <b>Long:</b>" + lon2 + ". <br> <br>"
	output.innerHTML += "The calculated distance between these two points is: <b>" + input_coords_distance + "km</b>. <br> <br>"
	output.innerHTML += "Fascinating."
}

/*
 * @desc Calculates the distance in kilometres between two points 
 * @param point1_lat latitude dec degree value of point one
 * @param point2_lat latitude dec degree value of point two
 * @param point1_long longitude dec degree value of point one
 * @param point2_long longitude dec degree value of point two
 * @return distance
 */
function GetDistance(point1_lat, point1_long, point2_lat, point2_long) {
	// Convert coordinates to rad 
	var radlat1 = Math.PI * point1_lat/180;
	var radlat2 = Math.PI * point2_lat/180;
	var radlon1 = Math.PI * point1_long/180;
	var radlon2 = Math.PI * point2_long/180;

	// Calculate radians distance to be able to use trigonometric functions
	var theta = point1_long-point2_long;
	var radtheta = Math.PI * theta/180;
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	
	// Convert radians distance to miles
	dist = Math.acos(dist)
	dist = dist * 180 / Math.PI;
	dist = dist * 60 * 1.1515;
	
	// Convert from miles to kilometers
	dist = dist * 1.609344; 
	return dist;
}
