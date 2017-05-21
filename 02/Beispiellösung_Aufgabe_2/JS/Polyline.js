/**  
* @desc Polyline class containing several lines
* @author Steffen loos s_loos02@uni-muenster.de
*/
function Polyline () {
	this.lines = [];

	/* 
	* @desc Adds a new line to the polyline
	*/
    this.addLine = function(line) {
		this.lines[this.lines.length]=line;
	}
	
	/* 
	* @desc Sum up all the lengths of the lines 
	* @return full distance in km
	*/
    this.getFullLength = function() {
		if(!this.lines) return 0;
		var distance=0;
		for	(index = 0; index < this.lines.length; index++) {
			distance += this.lines[index].getLength();
		} 
		return distance;
	}
}