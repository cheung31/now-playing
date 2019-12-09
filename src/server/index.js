import App from '../client/App';
import React from 'react';
import express from 'express';
import { StaticRouter, matchPath } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import tmdbRouter from './router.tmdb';
import routes from '../routes';

require('dotenv').config();

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();

server.use('/tmdb', tmdbRouter);
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    // First we iterate through our top level routes
    // looking for matches against the current url.
    const matches = routes.map((route, index) => {
      const match = matchPath(req.url, route.path, route);
      // We then look for static getInitialData function on each top level component
      if (match) {
        return {
          route,
          match,
          promise: route.component.getInitialData
            ? route.component.getInitialData({match, req, res})
            : Promise.resolve(null),
        };
      }
      return null;
    });

    if (matches.length === 0) {
      res.status(404).send('Not Found');
    }

    // Now we pull out all the promises we found into an array.
    const promises = matches.map(match => (match ? match.promise : null));
    Promise.all(promises)
      .then(initialData => {
        const context = {};
        const markup = renderToString(
          <StaticRouter context={context} location={req.url}>
            <App routes={routes} initialData={initialData} />
          </StaticRouter>
        );

        if (context.url) {
          res.redirect(context.url);
        } else {
          res.status(200).send(
            `<!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charset="utf-8" />
        <title>Welcome to Razzle</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${
              assets.client.css
                ? `<link rel="stylesheet" href="${assets.client.css}">`
                : ''
            }
        ${
              process.env.NODE_ENV === 'production'
                ? `<script src="${assets.client.js}" defer></script>`
                : `<script src="${assets.client.js}" defer crossorigin></script>`
            }
    </head>
    <body>
        <div id="root">${markup}</div>
        <script>window._INITIAL_DATA_ = ${JSON.stringify(initialData)};</script>
    </body>
</html>`
          );
        }
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ error: error.message, stack: error.stack });
      });
  });

export default server;
