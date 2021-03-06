"use strict";

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db, ObjectID) {
  return {

    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
        db.collection("tweets").insertOne(newTweet);
        callback(null, true);
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function(callback) {
      const sortNewestFirst = (a, b) => a.created_at - b.created_at;
      db.collection("tweets").find().toArray((err, tweets) => {
      if (err) {
        return callback(err);
      }
      callback(null, tweets.sort(sortNewestFirst));
    });
    },

    /* returns a user from the db
    *  params: a query object passed to the db and a callback */
    getUser: function(query, callback){
      db.collection('users').findOne(query, (err, user) => {
        if (err) {
          return callback(err);
        }
        callback(null, user);
      });
    },
    saveUser: function(newUser, callback){
      db.collection("users").insertOne(newUser, (err, res) => callback(err, res));
    },

    createIdQuery: function(id){
      return {_id : new ObjectID(id)};

    }
  }
}
