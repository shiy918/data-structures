var express = require('express'),
    app = express();
var fs = require('fs');

// Postgres
const { Pool } = require('pg');
var db_credentials = new Object();
db_credentials.user = 'shiy918';
db_credentials.host = process.env.AWSRDS_EP;
db_credentials.database = 'shidb';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

app.get('/', function(req, res) {
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);

    // SQL query
    var q = `SELECT EXTRACT(DAY FROM sensortime AT TIME ZONE 'America/New_York') as sensorday, 
             EXTRACT(MONTH FROM sensortime AT TIME ZONE 'America/New_York') as sensormonth, 
             count(*) as num_obs, 
             max(lightsensor) as max_light, 
             min(lightsensor) as min_light,
             avg(lightsensor) as avg_light, 
             sum(magnetsensor) as num_closedCurtain
             FROM sensors
             GROUP BY sensormonth, sensorday;`;
             
    client.connect();
    client.query(q, (qerr, qres) => {
        res.send(qres.rows);
        console.log('responded to request');
    });
    client.end();
});

// app.listen(process.env.PORT, function() {
app.listen(3000, function() {
    console.log('Server listening...');
});