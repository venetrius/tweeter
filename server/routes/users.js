"use strict";


const express       = require('express');
const usersRoutes  = express.Router();

const initUser = function(userData){
  if(userData.name && userData.tagname && userData.email && userData.password){
    return {
      name : userData.name,
      tagname : userData.tagname,
      email : userData.email,
      password : userData.password
    }
  }
}

const createUser = function(DataHelpers, userProfile, req, res){
    DataHelpers.getUser({email : req.body.email},
      function(error, user){
        if(error){
          return res.status(500).send();
        }
        if(user){
          return res.status(400).send('email adress already in use');
        }else{
          DataHelpers.saveUser(userProfile,
            (err, newUser) => {
              if (err){
                return res.status(500).send();
              }
              res.status(201).json(newUser.ops[0]);
            }
          )
        }
      }
    );
}

module.exports = function(DataHelpers) {

  usersRoutes.post("/login",
    function(req, res) {
      DataHelpers.getUser({email : req.body.email}, function(error, user){
        if(error){
          return res.status(400).send();
        }
        if(user && user.password === req.body.password){
          res.status(201).send('<body>Yeeey good job</body');
        }else{
          res.status(403).send('<body>Unauthorized</body');
        }
      });
    }
  );

  usersRoutes.post("/",
    function(req, res) {
      const userProfile = initUser(req.body);
      if(!userProfile){
        return res.status(400).json({ error: 'invalid request: incomplete form'});
      }
      createUser(DataHelpers, userProfile, req, res);
    }
  );

  return usersRoutes;

}
