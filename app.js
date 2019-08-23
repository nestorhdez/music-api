const express = require('express');
const app = express();
const cors = require('cors')
const SongsV1 = require('./app/v0.1/routes')

// Middlewares. express.json() => Si no el body llega vacio.
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }))

/**
 * Routing API V1.0
 */
app.use('/api/v1', SongsV1)

module.exports = app