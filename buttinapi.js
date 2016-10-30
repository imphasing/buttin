'use strict';

const AWS = require('aws-sdk');
const moment = require('moment');
const momenttz = require('moment-timezone');

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

        console.log(JSON.stringify(results));

        cb(results);
    });
}

exports.handler = (event, context, callback) => {
    retrieveEvents(function(results) {
        var local = results.map(function (item) {
            return {
                localTime: moment(item.timestamp).tz('America/Los_Angeles'),
                type: item.type
            };
        });

        var dailyBreakdown = {};

        local.forEach(function (item) {
            var key = item.localTime.format('YYYY-MM-DD');
            if (!(key in dailyBreakdown)) {
                dailyBreakdown[key] = {
                    wet: 0,
                    bm: 0
                };
            }

            var bm = 0;
            var wet = 0;

            if (item.type == "BM" || item.type == "BOTH") {
                bm++;
            }
            if (item.type == "WET" || item.type == "BOTH") {
                wet++;
            }

            dailyBreakdown[key].wet += wet;
            dailyBreakdown[key].bm += bm;
        });

        var totals = {
            wet: 0,
            bm: 0
        };

        var averages = {
            wet: 0,
            bm: 0
        }

        Object.keys(dailyBreakdown).forEach(function (key) {
            totals.wet += dailyBreakdown[key].wet;
            totals.bm += dailyBreakdown[key].bm;
        });

        averages.bm = totals.bm / Object.keys(dailyBreakdown).length;
        averages.wet = totals.wet / Object.keys(dailyBreakdown).length

        var report = {
            dailyBreakdown: dailyBreakdown,
            totals: totals,
            averages: averages 
        }

        context.succeed(JSON.stringify(report));
    });  
};
