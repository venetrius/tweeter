"use strict";


const express       = require('express');
const usersRoutes  = express.Router();
const userHelper    = require("../lib/util/user-helper")

const initUser = function(userData){
  if(userData.name && userData.tagname && userData.email && userData.password){
    return {
      name : userData.name,
      tagname : userData.tagname,
      email : userData.email,
      password : userData.password,
      avatars : userHelper.generateUserAvatar(userData.tagname)
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
              req.session.user_id = newUser._id;
              res.status(201).json(newUser.ops[0]);
            }
          )
        }
      }
    );
}

// Helper functions handling the communication with a db users collection
module.exports = function(DataHelpers) {

  usersRoutes.post("/login",
    function(req, res) {
      DataHelpers.getUser({email : req.body.email}, function(error, user){
        if(error){
          return res.status(400).send();
        }
        if(user && user.password === req.body.password){
          req.session.user_id = user._id;
          // TODO how safe is to pass a user _id (from db) as a cookie param?
          // probably not too much as it never expires?
          res.status(201).send();
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
