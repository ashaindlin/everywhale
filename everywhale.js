var http = require('http');
var Twit = require('twit');
var AWS = require('aws-sdk');
var config = require('./config.js');

var T = new Twit(config.twit);
var s3 = new AWS.S3()

http.createServer(function(request, response) {
    response.writeHead(302, {
        'Location': 'http://twitter.com/everywhale'
    });
    response.end();
}).listen(process.env.PORT);

function tweet() {
    s3.getObject({ Bucket: 'everywhale', Key: 'unused.txt' }, function(err, data) {
        if (err) throw err;
        var items = data.Body.toString().split('\n');
        if (items.length == 0 || (items.length == 1 && items[0] == '')) {
            return; // completed!
        }
        var index = Math.floor(Math.random()*items.length);
        var item = items[index];
        items.splice(index, 1);
        message = item + ' whale';
        console.log(message);
        T.post('statuses/update', { status: message }, function(err, data, res) {
            if (err) throw err;
            console.log(data);
            params = { Bucket: 'everywhale', Key: 'unused.txt' };
            params.Body = items.join('\n');
            s3.putObject(params, function(err, data) {
                if (err) throw err;
                console.log(data);
            });
            s3.getObject({ Bucket: 'everywhale', Key: 'used.txt' }, function (err, data) {
                if (err) throw err;
                params.Key = 'used.txt';
                params.Body = data.Body.toString() + item + '\n';
                s3.putObject(params, function(err, data) {
                    if (err) throw err;
                    console.log(data);
                });
            });
        });
    });
}

tweet();

setInterval(function() {
    try {
        tweet();
    } catch(e) {
        console.log(e);
    }
}, 3600000); // tweet once every hour
