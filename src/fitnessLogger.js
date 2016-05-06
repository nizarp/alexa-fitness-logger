/**
 * @Author: Mohamed Nisar <mohamedn@qburst.com>
 */

'use strict';
var AlexaSkill = require('AlexaSkill'),
    eventHandlers = require('eventHandlers'),
    intentHandlers = require('intentHandlers');

var APP_ID = 'amzn1.echo-sdk-ams.app.9b697aa4-e375-4f15-b2af-5ba120e950ab';
var skillContext = {};

/**
 * fitnessLogger is a child of AlexaSkill.
 */
var fitnessLogger = function () {
    AlexaSkill.call(this, APP_ID);
    skillContext.needMoreHelp = true;
};


// Extend AlexaSkill
fitnessLogger.prototype = Object.create(AlexaSkill.prototype);
fitnessLogger.prototype.constructor = fitnessLogger;

eventHandlers.register(fitnessLogger.prototype.eventHandlers, skillContext);
intentHandlers.register(fitnessLogger.prototype.intentHandlers, skillContext);

module.exports = fitnessLogger;

