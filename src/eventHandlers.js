/**
 * @Author: Mohamed Nisar <mohamedn@qburst.com>
 */

'use strict';
var textHelper = require('textHelper');

var registerEventHandlers = function (eventHandlers, skillContext) {
    eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
        //if user said a one shot command that triggered an intent event,
        //it will start a new session, and then we should avoid speaking too many words.
        skillContext.needMoreHelp = false;
    };

    eventHandlers.onLaunch = function (launchRequest, session, response) {
        //Speak welcome message and ask user questions
        
        var speechOutput = 'Welcome to Fitness Logger, What can I do for you?',
            reprompt = textHelper.helpText + ' What can I do for you?';
        response.ask(speechOutput, reprompt);
    };
};
exports.register = registerEventHandlers;
