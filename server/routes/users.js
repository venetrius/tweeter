"use strict";


const express       = require('express');
const usersRoutes  = express.Router();

module.exports = function(DataHelpers) {

  usersRoutes.post("/login", function(req, res) {
    // TODO conncet with db
    if (!req.body.email) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }
    console.log(req.body)
    res.status(201).send();

  });

  return usersRoutes;

}
