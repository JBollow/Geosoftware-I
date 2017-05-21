/**  
* @desc Class for a line with start/endpoint 
* @author Steffen loos s_loos02@uni-muenster.de
*
*/
function Line (startpoint, endpoint) {
    this.startpoint = startpoint;
    this.endpoint = endpoint;
	
	/* 
	* @desc Calculates the distance between start and endpoint 
	* @return distance in km
	*/
    this.getLength = function() {
		// Convert coordinates to rad 
		var radlat1 = Math.PI * startpoint.lat/180;
		var radlat2 = Math.PI * endpoint.lat/180;
		var radlon1 = Math.PI * startpoint.lon/180;
		var radlon2 = Math.PI * endpoint.lon/180;

		// Calculate rad distance to be able to use trigonometric functions
		var theta = startpoint.lon-endpoint.lon;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		
		// Convert rad distance to miles
		dist = Math.acos(dist)
		dist = dist * 180 / Math.PI;
		dist = dist * 60 * 1.1515;
		
		// Convert from miles to kilometers
		dist = dist * 1.609344; 
		
		return dist;
    };
}