/**
 * authors: Jan-Patrick Bollow 349891, Anna Formaniuk 427493, Jens Seifert 408076
 * 
 */

'use strict';

/**
 * Logs aren't saved local, but visible in console using ConsoleAppender
 * http://jsnlog.com/Documentation/WebConfig/JSNLog/ConsoleAppender 
 *     
// JSNLog
logger.info("");
 */

// JSNLogger using consoleappender
var logger = JL();
var consoleAppender = JL.createConsoleAppender('consoleAppender');
logger.setOptions({
    "appenders": [consoleAppender]
});