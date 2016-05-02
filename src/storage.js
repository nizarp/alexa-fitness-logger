/**
 * @Author: Mohamed Nisar <mohamedn@qburst.com>
 * 
 * This file contains Db storage and management logic for all indents.
 */

'use strict';
var mysql = require('mysql'),
    alexaDateUtil = require('alexaDateUtil'),
    textHelper = require('textHelper');

var connection = mysql.createConnection({
    host     : 'xxxxxxxxxxxxx.us-east-1.rds.amazonaws.com',
    user     : 'username',
    password : 'password',
    database : 'database',
    debug    : true
});

var storage = (function () {
    
    function Workout(session, data) {
        if (data) {
            this.data = data;
        } else {
            this.data = {
                'exercise': null,
                'count': null,
                'weight': null,
                'unit': null
            };
        }
        this._session = session;
    }
    
    Workout.prototype = {
        /**
         * Store an exercise into Db
         */
        save: function (response) {
            var query = 'REPLACE INTO workouts(user_id, day, exercise_id, reps, weight, unit, created_at)'+ 
                'VALUES ('+ connection.escape(this._session.user.userId) +', NOW(), '
                + this.data.exercise_code +', '+ connection.escape(this.data.count) +', '
                + connection.escape(this.data.weight) +', '
                + connection.escape(this.data.unit) +', NOW())';
            
            connection.query(query, (function(data){
                return function(err, rows) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    
                    var speechOutput = data.count + ' ' + data.exercise;
                    if(data.weight != 0) {
                        speechOutput += ' with '+ data.weight + ' ' + data.unit;
                    }                    
                    speechOutput += ' added to your workout.'+
                        ' You can say correction if you want to clear your last workout at any time.';
                    response.tell(speechOutput);
                };
            })(this.data));
        } 
    };   
    
    return {
        /**
         * Validates input for save exercise action and calls Save method on success
         */
        saveWorkout: function (session, data, response) {
            var currentWorkout;
            var query = "SELECT exercise_code FROM exercises WHERE name = ?";
            
            connection.query(query, [data.exercise], function(err, rows) {
                if (err) {
                    console.log(err);
                    return;
                }
                
                if(rows[0] !== undefined) {
                    data.exercise_code = rows[0].exercise_code;   
                    
                    currentWorkout = new Workout(session, data);
                    currentWorkout.save(response);
                } else {                    
                    var speechOutput = textHelper.invalidExercise;
                    var reprompt = "Please say your command."
                    response.ask(speechOutput, reprompt);
                }
            });
        },
        
        /**
         * Delete last saved exercise
         */
        deleteLastWorkout: function(session, response){
            var query = "DELETE FROM workouts WHERE user_id = '"+ session.user.userId 
                +"' ORDER BY ID DESC LIMIT 1";
            
            connection.query(query, function(err, result) {
                if (err) {
                    console.log(err);
                    return;
                }
                
                console.log(result.affectedRows);
                
                var speechOutput = 'Your last workout is now cleared. Please repeat your exercise.';
                response.tell(speechOutput);
            });
        },
        
        /**
         * Find the best combination of weight and reps for a particular exercise
         */
        findPersonalBest: function(session, response, exercise){
            var exercise_code;
            var query = "SELECT exercise_code FROM exercises WHERE name = ?";
            
            connection.query(query, [exercise], function(err, rows) {
                if (err) {
                    console.log(err);
                    return;
                }
                
                if(rows[0] !== undefined) {
                    exercise_code = rows[0].exercise_code;   
                    
                    var query = "SELECT day,reps,weight,unit FROM workouts WHERE exercise_id = ?"+
                        " AND user_id = '"+ session.user.userId +"'"+
                        " ORDER BY (if(weight>0, weight,1)*reps) DESC LIMIT 1";
                    
                    connection.query(query, [exercise_code], function(err, rows) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        
                        if(rows[0] !== undefined) {
                            var speechOutput = 'Your personal best for '+ exercise + ' is '+
                                rows[0].reps + ' reps';
                            if(rows[0].weight != 0) {
                                speechOutput += ' with '+ rows[0].weight + rows[0].weight;
                            }
                            speechOutput += ' on '+ alexaDateUtil.getFormattedDate(rows[0].day) + '.';
                            response.tell(speechOutput);
                        } else {
                            var speechOutput = 'You haven\'t logged any '
                                + exercise +' yet. Please try a different exercise.';
                            var reprompt = "Please say your command."
                            response.ask(speechOutput, reprompt);
                        }
                    });

                } else {                    
                    var speechOutput = textHelper.invalidExercise;
                    var reprompt = "Please say your command."
                    response.ask(speechOutput, reprompt);
                }
            });
        },
        
        /**
         * Find stats for a particular exercise on a given date
         */
        findExerciseOnDate: function(session, response, exercise, day) {
            var exercise_code;
            var query = "SELECT exercise_code FROM exercises WHERE name = ?";
            
            connection.query(query, [exercise], function(err, rows) {
                if (err) {
                    console.log(err);
                    return;
                }
                
                if(rows[0] !== undefined) {
                    exercise_code = rows[0].exercise_code;   
                    
                    var query = "SELECT day,reps,weight,unit FROM workouts w "+
                        " WHERE w.day = '"+ alexaDateUtil.getDbFormattedDate(day) + "' "+
                        " AND w.exercise_id = "+ exercise_code + 
                        " AND w.user_id = '"+ session.user.userId +"'";
                    
                    connection.query(query, function(err, rows) {
                        if (err) {
                            console.log(err);
                            return;
                        }

                        // If records exist
                        if(rows.length > 0) {
                            var speechOutput = 'Your stats for '+ exercise + ' on '+ 
                                alexaDateUtil.getFormattedDate(new Date(day));
                                
                            // If just one record
                            if(rows.length == 1) {
                                speechOutput += ' is'
                            } else {
                                speechOutput += ' are'
                            }
                            
                            for(var i=0; i < rows.length; i++) {
                                if(rows.length > 1 && i == rows.length-1) {
                                    speechOutput += " and";
                                }
                                speechOutput += ", " + rows[i].reps + ' reps ';
                                if(rows[i].weight > 0) {
                                    speechOutput += ' with '+ rows[i].weight + ' ' + rows[i].unit;
                                }
                            }
                            
                            response.tell(speechOutput);
                            
                        } else {
                            var speechOutput = 'You haven\'t logged any '
                                + exercise + ' on '+ alexaDateUtil.getFormattedDate(new Date(day)) 
                                +'. Please try a different combination.';
                            var reprompt = "Please say your command."
                            response.ask(speechOutput, reprompt);
                        }
                    });

                } else {                    
                    var speechOutput = textHelper.invalidExercise;
                    var reprompt = "Please say your command."
                    response.ask(speechOutput, reprompt);
                }
            });
        },
        
        /**
         * Find all exercises on a given date
         */
        findAllExercisesOnDate: function(session, response, day) {            
                
            var query = "SELECT day,reps,weight,name,unit FROM workouts w "+
                " LEFT JOIN ("+
                " SELECT * FROM (select name, exercise_code FROM exercises order by ID desc"+
                " )e1 group by exercise_code) e ON e.exercise_code = w.exercise_id "+
                " WHERE w.day = '"+ alexaDateUtil.getDbFormattedDate(day) + "' "+
                " AND w.user_id = '"+ session.user.userId +"'";
            
            console.log(query);
            
            connection.query(query, function(err, rows) {
                if (err) {
                    console.log(err);
                    return;
                }

                if(rows.length > 0) {
                    var speechOutput = '';
                        
                    if(rows.length == 1) {
                        speechOutput += 'Your exercise on ' 
                            + alexaDateUtil.getFormattedDate(new Date(day)) + ' is';
                    } else {
                        speechOutput += 'Your exercises on ' 
                            + alexaDateUtil.getFormattedDate(new Date(day)) + ' are';
                    }
                    
                    for(var i=0; i < rows.length; i++) {
                        if(rows.length > 1 && i == rows.length-1) {
                            speechOutput += ", " + " and";
                        }
                        speechOutput += ", " + rows[i].reps + ' ' + rows[i].name;
                        if(rows[i].weight > 0) {
                            speechOutput += ' with '+ rows[i].weight + ' ' + rows[i].unit;
                        }
                    }
                    
                    response.tell(speechOutput);
                    
                } else {
                    var speechOutput = 'You haven\'t logged any exercises on '+ 
                        alexaDateUtil.getFormattedDate(new Date(day)) 
                        +'. Please try a different day.';
                    var reprompt = "Please say your command."
                    response.ask(speechOutput, reprompt);
                }
            });
        },
        
        /**
         * Find all exercises in the Db
         */
        getAllExercises: function(response){
            var query = "select name from exercises group by exercise_code";
        
            connection.query(query, function(err, rows) {
                if (err) {
                    console.log(err);
                    return;
                }
                var speechOutput;
                
                if(rows.length > 0) {
                    speechOutput = 'Supported exercises are';
                    for(var i=0; i<rows.length; i++) {
                        if(rows.length > 1 && i == rows.length-1) {
                            speechOutput += " and";
                        }
                        speechOutput += ", " + rows[i].name;
                    }                    
                } else {
                    speechOutput = "Sorry, no exercises supported at the moment";                    
                }
                
                response.tell(speechOutput);
                
            });
        },
    };
    
})();
module.exports = storage;
