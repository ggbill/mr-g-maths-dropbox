import app from './app';
import * as http from 'http';


const PORT = process.env.PORT || 8080;
const server = http.createServer(app);

server.listen(PORT);

server.on('error', (err) => {
    console.error(err);
});

server.on('listening', async () => {
    console.info(`Listening on a port ${PORT}`);
});