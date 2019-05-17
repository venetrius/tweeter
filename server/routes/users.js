"use strict";


const express       = require('express');
const usersRoutes  = express.Router();

module.exports = function(DataHelpers) {

  usersRoutes.post("/login",
    function(req, res) {
      DataHelpers.getUser(req.body.email, function(error, user){
        if(error){
          return res.status(400).send();
        }
        if(user.password === req.body.password){
          res.status(201).send('<body>Yeeey good job</body');
        }else{
          res.status(403).send('<body>Unauthorized</body');
        }
      });
    }
  );

  return usersRoutes;

}
