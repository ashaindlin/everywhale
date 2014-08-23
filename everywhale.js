var fs = require('fs');
var http = require('http');
var Twit = require('twit');
var config = require('./config.js');
var T = new Twit(config.twit);

var server = http.createServer(function(request, response) {
    response.writeHead(302, {
        'Location': 'http://twitter.com/everywhale'
    });
    response.end();
});

function tweet() {
    fs.readFile('./resources/unused.txt', function(err, data) {
        if (err) throw err;
        var items = data.toString().split('\n');
        if (items.length == 0 || (items.length == 1 && items[0] == '')) {
            T.post('statuses/update', { status: 'completed. i think this project went very whale!' }, function(err, data, res) {
                console.log("completed!");
                process.exit(0);
            });
        }
        var index = Math.floor(Math.random()*items.length);
        var item = items[index];
        items.splice(index, 1);
        message = item + ' whale';
        console.log(message);
        T.post('statuses/update', { status: message }, function(err, data, res) {
            if (err) throw err;
            console.log(data);
            fs.writeFileSync('./resources/unused.txt', items.join('\n'));
            fs.appendFileSync('./resources/used.txt', (item + '\n'));
        });
    });
}

server.listen(process.env.PORT);

tweet();

setInterval(function() {
    try {
        tweet();
    } catch(e) {
        console.log(e);
    }
}, 3600000); // tweet once every hour
