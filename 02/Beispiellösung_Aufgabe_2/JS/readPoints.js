/**  
* @desc Create a polyline, add lines read from a given file and insert the full length in the HTML document
* @author Steffen loos s_loos02@uni-muenster.de
* @param event OpenFile event
*/
var ReadPolyline = function(event) {
	
	// Init
	var input = event.target;
	var polyline = new Polyline();
    var reader = new FileReader();
	
	/**
	* @desc Invoked when file is loading. Reads each line and 
	*		generates Lines for the Polyline
	*/ 
    reader.onload = function(){
		// By lines
		var lines = reader.result.split('\n');
		var oldpoint=null; // To save the last valid points
		var createdpoint=false;
		for(var i = 0; i < lines.length; i++){
			// Remove Comments
			lines[i]=lines[i].split("//")[0];
			var linespli=lines[i].split(",");
			
			// Validate correct format
			if(linespli.length==2 && isNaN(parseFloat(linespli[0]))==false  && isNaN(parseFloat(linespli[1]))==false) {
				// Create line from current data and add it to polyline
				var newpoint=new Point(linespli[0].trim(), linespli[1].trim());	
				
				if(oldpoint!=null) {
					var tmpline=new Line(oldpoint, newpoint);
					polyline.addLine(tmpline);
					createdpoint=true;
				}
				
				oldpoint=newpoint;
			}
		}
		
		// Show calculated value in HTML doc
		var elem = document.getElementById("distancevalue");
		
		if(createdpoint) {
			elem.innerHTML = "Polyline length: "+polyline.getFullLength()+" km<br>";
		} else {
			elem.innerHTML = "Couldn't load points from file<br>";
		}
	};
	
	
	// Read the file
    reader.readAsText(input.files[0]);
  };
  
