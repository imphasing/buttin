'use strict';

const AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();

/**
 * The following JSON template shows what is sent as the payload:
{
    "serialNumber": "GXXXXXXXXXXXXXXXXX",
    "batteryVoltage": "xxmV",
    "clickType": "SINGLE" | "DOUBLE" | "LONG"
}
 *
 * A "LONG" clickType is sent if the first press lasts longer than 1.5 seconds.
 * "SINGLE" and "DOUBLE" clickType payloads are sent for short clicks.
 *
 * For more documentation, follow the link below.
 * http://docs.aws.amazon.com/iot/latest/developerguide/iot-lambda-rule.html
 */


var logSingle = function(type, cb) {
    var date = new Date();
    var utcTimeStamp = date.getTime();

    var params = {
        Item: {
            timestamp: {
                N: utcTimeStamp.toString()
            },
            type: {
                S: type
            }
        },
        TableName: 'babyevents'
    };

    dynamodb.putItem(params, function(err, data) {
      if (err) console.log(err, err.stack);
      else console.log(data);
      cb();
    });
}


exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event));

    var diaperType = "";
    if (event.clickType == "SINGLE") {
        diaperType = "WET";
    } else if (event.clickType == "DOUBLE") {
        diaperType = "BM";
    } else if (event.clickType == "LONG") {
        diaperType = "BOTH";
    }
    
    logSingle(diaperType, function() {
        context.succeed("logged");
    });
    
};
