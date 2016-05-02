/**
 * @Author: Mohamed Nisar <mohamedn@qburst.com>
 * 
 * This file contains handler logic for all indents.
 */

'use strict';
var textHelper = require('textHelper'),
    storage = require('storage');

var registerIntentHandlers = function (intentHandlers, skillContext) {
    
    /**
     * Creates new exercise
     */
    intentHandlers.NewExcerciseIntent = function (intent, session, response) {   
        if(intent.slots.Exercise.value !== undefined && intent.slots.Count.value != undefined) {        
            var exercise = intent.slots.Exercise.value,
                count = intent.slots.Count.value;
            
            if(isNaN(count)) {
                var speechOutput = "That's not a valid workout. Please try again."+
                    " You can say, ten pull downs with twenty pounds.";
                var reprompt = "Please repeat your workout.";
                response.ask(speechOutput, reprompt);
            }
            
            if(intent.slots.Weight.value !== undefined && isNaN(intent.slots.Weight.value)) {
                var speechOutput = "That's not a valid weight. Please try again."+
                    " You can say, ten pull downs with twenty pounds.";
                var reprompt = "Please say your workout.";
                response.ask(speechOutput, reprompt);
            }
            
            if(intent.slots.WeightDecimal.value !== undefined && isNaN(intent.slots.WeightDecimal.value)) {
                var speechOutput = "That's not a valid weight. Please try again."+
                    " You can say, ten pull downs with twenty pounds.";
                var reprompt = "Please repeat your workout.";
                response.ask(speechOutput, reprompt);
            }
            
            var weight = calculateWeight(intent);
            
            var unit = calculateUnit(intent, weight);            
            var data = {
                'exercise'  : exercise,
                'count'     : count,
                'weight'    : weight,
                'unit'      : unit
            }; 
            
            storage.saveWorkout(session, data, response);
            
        } else {
            var speechOutput = "You have to specify the exercise and number of repetitions. "+
                "Please try again. You can say, ten pull downs with twenty pounds.";
            var reprompt = "Please say your workout."
            response.ask(speechOutput, reprompt);
        }
    };
    
    /**
     * Clears the last exercise
     */
    intentHandlers.CorrectionIntent = function (intent, session, response) {
        if(intent.slots.Correction.value !== undefined) {
            storage.deleteLastWorkout(session, response);
        } else {
            var speechOutput = 'Sorry, I didn\'t hear you. ' + textHelper.examplesText;
            var reprompt = "Please say your command."
            response.ask(speechOutput, reprompt);
        }
    };
    
    intentHandlers.PersonalBestIntent = function (intent, session, response) {        
        if(intent.slots.Exercise.value !== undefined) {
            var exercise = intent.slots.Exercise.value;            
            storage.findPersonalBest(session, response, exercise);
        } else {
            var speechOutput = "You have to specify the exercise. Please try again."+
                " You can say, Get my best for Pull downs.";
            var reprompt = "Please say your command."
            response.ask(speechOutput, reprompt);
        }
    };
    
    /**
     * Get stats for an exercise on a given date 
     */
    intentHandlers.GetExerciseOnDayIntent = function (intent, session, response) {        
        if(intent.slots.Exercise.value !== undefined && intent.slots.Day.value !== undefined) {
            var exercise = intent.slots.Exercise.value,
                day = intent.slots.Day.value;
            
                if(day == "") {
                    var speechOutput = "Sorry, I could not understand the date. Please try again."+
                        " You can say, Get my Push Ups on last Friday.";
                    var reprompt = "Please say your command."
                    response.ask(speechOutput, reprompt);
                }
            
            storage.findExerciseOnDate(session, response, exercise, day);
        } else {
            var speechOutput = "You have to specify exercise and date. Please try again."+
                    " You can say, Get my Push Ups on last Friday.";
            var reprompt = "Please say your command."
            response.ask(speechOutput, reprompt);
        }
    };
    
    /**
     * Gets all exercises on a given date
     */
    intentHandlers.GetAllExerciseOnDayIntent = function (intent, session, response) {        
        if(intent.slots.Day.value !== undefined) {
            var day = intent.slots.Day.value;
            
            if(day == "") {
                var speechOutput = "Sorry, I could not understand the date. Please try again."+
                    " You can say, Get my exercises on last Friday.";
                var reprompt = "Please say your command."
                response.ask(speechOutput, reprompt);
            }
            
            storage.findAllExercisesOnDate(session, response, day);
        } else {
            var speechOutput = "You have to specify the date. Please try again. "+
                "You can say, Get my exercises on last Friday.";
            var reprompt = "Please say your command."
            response.ask(speechOutput, reprompt);
        }
    };
    
    /**
     * Get a list for all supported exercises
     */
    intentHandlers.GetAllExercisesIntent = function (intent, session, response) {
        storage.getAllExercises(response);
    };
    
    intentHandlers.MyHelpIntent = function (intent, session, response) {
        var speechOutput = textHelper.helpText + textHelper.examplesText;
        var reprompt = "What would you like?"
        response.ask(speechOutput, reprompt);
    };
    
    intentHandlers.MyCancelIntent = function (intent, session, response) {
        var speechOutput = "Goodbye. Thanks for using Fitness Logger.";
        response.tell(speechOutput);
    };
    
    intentHandlers['AMAZON.HelpIntent'] = function (intent, session, response) {
        var speechOutput = textHelper.helpText + textHelper.examplesText;
        var reprompt = "What would you like?"
        response.ask(speechOutput, reprompt);
    };
    
    intentHandlers['AMAZON.CancelIntent'] = function (intent, session, response) {
        var speechOutput = "Okay.";
        response.tell(speechOutput);
    };

    intentHandlers['AMAZON.StopIntent'] = function (intent, session, response) {
        var speechOutput = "Goodbye. Thanks for using Fitness Logger.";
        response.tell(speechOutput);
    };
    
};

/**
 * Calculates weight from user inputs.
 */
var calculateWeight = function(intent) {
    
    var weight;
    if(intent.slots.Weight.value !== undefined && !isNaN(intent.slots.Weight.value)) {        
        if(intent.slots.WeightFraction.value !== undefined) {
            if(intent.slots.WeightFraction.value == 'half') {
                weight = parseInt(intent.slots.Weight.value) + .50;
            } else if(intent.slots.WeightFraction.value == 'quarter') {
                weight = parseInt(intent.slots.Weight.value) + .25;
            } else {
                weight = intent.slots.Weight.value;
            }
        } else if(intent.slots.WeightDecimal.value !== undefined 
                && !isNaN(intent.slots.WeightDecimal.value)) {                
            var places = 10;
            for(var i=1; i<intent.slots.WeightDecimal.value.length; i++){
                places = places*10;
            }
            
            weight = parseInt(intent.slots.Weight.value) + 
                (parseInt(intent.slots.WeightDecimal.value) / places); 
            
        } else {
            weight = intent.slots.Weight.value;
        }
    } else {
        weight = 0;
    }
    
    return parseFloat(weight);
};

var calculateUnit = function(intent, weight) {
    
    if(weight === 0) {
        return null;
    }
    
    var unit;    
    if(intent.slots.WeightUnit.value !== undefined) {
        switch(intent.slots.WeightUnit.value) {
            case 'pound':
            case 'pounds':
            case 'lb':
            case 'lbs':
                unit = "pound" + ((weight > 1) ? 's' : '');
                break;                                                
            case 'kg':
            case 'kgs':
            case 'kilo':
            case 'kilos':
            case 'kilogram':
            case 'kilograms':
                unit = "kilogram" + ((weight > 1) ? 's' : '');
                break;                        
            default:
                unit = "pound" + ((weight > 1) ? 's' : '');
                break;
        }
    } else {
        unit = "pound" + ((weight > 1) ? 's' : '');
    }
    
    return unit;
}

exports.register = registerIntentHandlers;
