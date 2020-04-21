'use strict';

/**
  * @module server.js
  * @author John Butler
  * @description 
*/

const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema');
const app = express();

// logging
// app.use((req, res, next) => {
// 	console.log(`req_IP:${req.ip} - method:${req.method} - url:${req.url}`);
// 	next();
// });

app.use(
	'/graphql',
	expressGraphQL({
		schema,
		graphiql: true
	})
);

app.listen(4000, () => {
	console.log('Listening on port 4000');
});
