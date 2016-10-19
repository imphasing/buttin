'use strict';

const AWS = require('aws-sdk');
const moment = require('moment');

var dynamodb = new AWS.DynamoDB();

var retrieveEvents = function(cb) {
    var results = [];

    var params = {
        TableName: 'babyevents',
    };

    dynamodb.scan(params, function(err, data) {
        if (err) console.log(err, err.stack);

        results = data.Items.map(function (item) {
            return { 
                timestamp: parseInt(item.timestamp.N),
                type: item.type.S
            };
        });

        cb(results);
    });
}

exports.handler = (event, context, callback) => {
    retrieveEvents(function(results) {
        var local = results.map(function (item) {
            return {
                localTime: moment(item.timestamp).zone('America/Seattle').format('YYYY-MM-DD HH:mm'),
                type: item.type
            };
        });

        context.succeed(JSON.stringify(local));
    });  
};
