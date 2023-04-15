/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
const SERVER_URL = '/classes/messages';
let _storage = [];
let counter = 0;

const requestHandler = function(request, response) {
  if (request.url === SERVER_URL) {
    if (request.method === 'POST') {
      //console.log('-------- POST --------');

      let body = [];
      request
        .on('error', error => {
          console.error(error.stack)
        })
        .on('data', chunk => body.push(chunk))
        .on('end', () => {
          body = JSON.parse(Buffer.concat(body).toString());

          const headers = defaultCorsHeaders;
          headers['Content-Type'] = 'application/json';
          response.writeHead(201, headers);

          const data = [{
            createdAt: new Date().getTime(),
            message_id: counter++
          }];

          body.createdAt = data[0].createdAt;
          body.message_id = data[0].message_id;

          _storage.push(body);

          response.end(JSON.stringify(data));
        });
    }
    if (request.method === 'GET') {
      //console.log('-------- GET --------');

      let headers = defaultCorsHeaders;
      headers['Content-Type'] = 'application/json';
      response.writeHead(200, headers);

      response.end(JSON.stringify(_storage));
    }
    if (request.method === 'OPTIONS') {
      // console.log('OPTIONS --------');

      let headers = defaultCorsHeaders;
      response.writeHead(200, headers);
      response.end();
    }
  } else if (request.url === '/') {
    response.writeHead(403);
    response.end();
  } else {
    response.writeHead(404);
    response.end();
    // console.log(' >>> 404 ERROR >>> ');
  }


  // // Request and Response come from node's http module.
  // //
  // // They include information about both the incoming request, such as
  // // headers and URL, and about the outgoing response, such as its status
  // // and content.
  // //
  // // Documentation for both request and response can be found in the HTTP section at
  // // http://nodejs.org/documentation/api/

  // // Do some basic logging.
  // //
  // // Adding more logging to your server can be an easy way to get passive
  // // debugging help, but you should always be careful about leaving stray
  // // console.logs in your code.
  // console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // // The outgoing status.
  // const statusCode = 200;

  // // See the note below about CORS headers.
  // const headers = defaultCorsHeaders;

  // // Tell the client we are sending them plain text.
  // //
  // // You will need to change this if you are sending something
  // // other than plain text, like JSON or HTML.
  // headers['Content-Type'] = 'text/plain';

  // // .writeHead() writes to the request line and headers of the response,
  // // which includes the status and all headers.
  // response.writeHead(statusCode, headers);

  // // Make sure to always call response.end() - Node may not send
  // // anything back to the client until you do. The string you pass to
  // // response.end() will be the body of the response - i.e. what shows
  // // up in the browser.
  // //
  // // Calling .end "flushes" the response's internal buffer, forcing
  // // node to actually send all the data over to the client.
  // response.end('Hello, World!');
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
const defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, authorization',
  'access-control-max-age': 10 // Seconds.
};

module.exports.requestHandler = requestHandler;