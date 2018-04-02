# FitnessLogger - Alexa Skill

FitnessLogger is an Alexa skill to keep track of your daily exercises. Using FitnessLogger, you can instruct Alexa to store your workouts without reaching out to your personal devices. You can tell FitnessLogger to save your current workout, clear your last saved workout, or you can ask for your best performance. You can always review your previous workouts by just specifying the date and exercise.

Following are the list of supported actions by FitnesLogger:

 - Save your current workout
 - Delete your last saved workout
 - Get all your workouts on a specific date
 - Get all workouts for a specific exercise on a particular date
 - Find your personal best for an exercise
 - Get a list of all supported exercises

To use Fitness Logger skill, try saying...

>Alexa, ask Fitness Logger to add ten pull downs with twenty pounds

>Alexa, ask Fitness Logger what's my best for push ups

>Alexa, ask Fitness Logger to get my bench presses on yesterday

FitnessLogger currently supports a pre-defined list of exercises. You can say "Alexa, ask Fitness Logger for all supported exercises" to get a list of all ​exercises.

## Setup
To run this example skill you need to do three things. The first is to deploy the code in lambda, second is to configure the Alexa skill to use Lambda. Finally, create a mysql instance in Amazon RDS and create the DB schema.

### AWS Lambda Setup

 - Go to the AWS Console and click on the Lambda link. Note: ensure you are in us-east or you won't be able to use Alexa with Lambda.
 - Click on the Create a Lambda Function or Get Started Now button.
 - Skip the blueprint
 - Name the Lambda Function "FitnessLogger".
 - Select the runtime as Node.js
 - Go to the the src directory, select all files and then create a zip file, make sure the zip file does not contain the src directory itself, otherwise Lambda function will not work.
 - Select Code entry type as "Upload a .ZIP file" and then upload the .zip file to the Lambda
 - Keep the Handler as index.handler (this refers to the main js file in the zip).
 - Create a basic execution role and click create.
 - Leave the Advanced settings as the defaults.
 - Click "Next" and review the settings then click "Create Function"
 - Click the "Event Sources" tab and select "Add event source"
 - Set the Event Source type as Alexa Skills kit and Enable it now. Click Submit.
 - Copy the ARN from the top right to be used later in the Alexa Skill Setup

### Alexa Skill Setup

 - Go to the Alexa Console and click Add a New Skill.
 - Set "FitnessLogger" as the skill name and "fitness logger" as the invocation name, this is what is used to activate your skill. For example you would say: "Alexa, open fitness logger"
 - Select the Lambda ARN for the skill Endpoint and paste the ARN copied from above. Click Next.
 - Copy the Intent Schema from the included IntentSchema.json.
 - Copy the Sample Utterances from the included SampleUtterances.txt. Click Next.
 - [optional] go back to the skill Information tab and copy the appId. Paste the appId into the index.js file for the variable APP_ID, then update the lambda source zip file with this change and upload to lambda again, this step makes sure the lambda function only serves request from authorized source.
 - You are now able to start testing your sample skill! You should be able to go to the Echo webpage and see your skill enabled.
 - In order to test it, try to say some of the Sample Utterances from the Examples section below.
 - Your skill is now saved and once you are finished testing you can continue to publish your skill.

### Database setup

Create a new MySQL instance as per the instructions provided here.

Then connect to your mysql instance and create a database using the schema available in database/db.sql
