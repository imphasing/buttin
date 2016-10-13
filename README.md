# buttin

this is a simple set of AWS Lambda functions for logging diaper changes for my sw8 baby. Logs to a dynamodb table, reporting interface is work in progress still.

This is hooked up to an AWS IoT button stuck to my changing table, ezpz to log diapers without having to remember to whip my phone out to use one of those stupid apps.

Table is a simple 2 column table, datetime in UTC and type of diaper. In the case of both pee and BM, a both entry is recorded so we don't lose the absolute number of diapers used. Reporting interface will account for that from its end.

![buttin](https://raw.githubusercontent.com/imphasing/buttin/master/buttin.jpg)