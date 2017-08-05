/** 
 *  @author Jan-Patrick Bollow 349891 
 */

'use strict';

// Get Time
function getTime() {
    var date = new Date();
    var now = date.toISOString().replace(/\.[0-9]{3}/, '').replace(/Z/, '');
    return now;
    // JSNLog
    logger.info("The time is:" + now);
}