/**
 * @Author: Mohamed Nisar <mohamedn@qburst.com>
 */
process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'];

'use strict';
var FitnessLogger = require('fitnessLogger');

exports.handler = function (event, context) {
    console.log(FitnessLogger);
    var fitnessLogger = new FitnessLogger();
    fitnessLogger.execute(event, context);    
};
