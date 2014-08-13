var http = require('http');

var server = http.createServer(function(request, response) {
    response.writeHead(302, {
        'Location': 'http://twitter.com/everywhale'
    });
    response.end();
});

server.listen(process.env.PORT);
