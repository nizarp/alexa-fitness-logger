/**
 * @Author: Mohamed Nisar <mohamedn@qburst.com>
 */

'use strict';
var AlexaSkill = require('AlexaSkill'),
    eventHandlers = require('eventHandlers'),
    intentHandlers = require('intentHandlers');

var APP_ID = undefined;//replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";
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

