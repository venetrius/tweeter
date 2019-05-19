"use strict";

const express       = require('express');
const tweetsRoutes  = express.Router();

module.exports = function(DataHelpers) {

  tweetsRoutes.get("/", function(req, res) {
    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(tweets);
      }
    });
  });

  tweetsRoutes.post("/", function(req, res) {
    const userId = req.session.user_id;
    if(!userId){
      res.status(403).send("You need to be logged in to use the functionality");
      return;
    }
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }
    DataHelpers.getUser(DataHelpers.createIdQuery(userId),
      function(error, user){
        if(error){
          res.status(500).send();
        }
        else if(!user){
          res.status(403).send('<body>Unauthorized</body');
        }
        else{
          const tweet = 
          {
            user: user,
            content: { text: req.body.text },
            created_at: Date.now()
          };
      
          DataHelpers.saveTweet(tweet, (err) => {
            if (err) {
              res.status(500).json({ error: err.message });
            } else {
              res.status(201).send(tweet);
            }
          });
        }
      }
    );    
  });

  return tweetsRoutes;

}
