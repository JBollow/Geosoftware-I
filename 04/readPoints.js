// HTML Code to call this function: <input type='file' accept='text/plain' onchange='ReadPolyline(event)'>


/**  
* @desc Create a polyline, add lines read from a given file and insert the full length in the HTML document
*
*
* @author author..
* @param event OpenFile event
*/
var ReadPolyline = function(event) {
	
	// Init
	var input = event.target;
    var reader = new FileReader();
	
	/**
	* @desc Invoked when file is loading. 
	*/ 
    reader.onload = function(){
		var filecontent=reader.result;
		
		/*
		*
		* Parsing..
		* ..
		*/
		
	};
	
	
	// Read the file
    reader.readAsText(input.files[0]);
  };
  
