/**
 * @Author: Mohamed Nisar <mohamedn@qburst.com>
 * 
 * This file contains all text helpers.
 */

'use strict';
var textHelper = (function () {
    return {
        helpText: 'You can store your workouts,'
            + ' find your workouts for a date, find your best for a workout,'
            + ' list all supported workouts, or clear your last workout. ',
        examplesText: 'Here\'s some things you can say,'
            + ' Add 10 push ups,'
            + ' Store twenty Pull downs with 20 pounds,'
            + ' what\'s my best for push ups,'
            + ' get me all supported exercises,'
            + ' find my exercises on last friday,'
            + ' get my push ups on yesterday,'
            + ' correction,'
            + ' help'
            + ' and exit. What would you like? ',
        invalidExercise: 'That\'s not a valid exercise. Please repeat. ',
    };
})();
module.exports = textHelper;
