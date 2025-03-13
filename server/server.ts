import appPromise from "./src/app";

import https from 'https';
import http from 'http';
import fs from 'fs';

appPromise.then((app) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`SumMate listening at http://localhost:${process.env.PORT} on development mode`);
    http.createServer(app).listen(process.env.PORT);
  } else {
    console.log(`SumMate listening at http://localhost:${process.env.PORT} on production mode`);

    const options2 = {
      key: fs.readFileSync('../client-key.pem'),
      cert: fs.readFileSync('../client-cert.pem')
    };
    https.createServer(options2, app).listen(process.env.HTTPS_PORT);
  }
});