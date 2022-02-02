const http = require('http');
const app = require('./app');

const server = http.createServer(app);

const port = process.env.PORT || 3030;

server.listen(port);

server.on('listening', () => {
    console.log('Server listening on port', port);
});
server.on('error', (err) => {
    console.log('Error while server listen ', err);
});