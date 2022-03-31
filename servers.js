const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

app.use(cors());
app.use("/public", express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true});
const defaultDate = new Date().toISOString().slice(0, 10);
const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true },
    exercises: [
      {
        description: { type: String },
        duration: { type: Number },
        date: { type: String, required: false }
      }
    ]
  }
);

const User = mongoose.model('Users', userSchema);

app.get('/', (req, res) => res.sendFile(__dirname + '/views/index.html'));

app.post("/api/users", function (req, res) {
  const username = req.body.username;
  if (!username || username.length === 0) res.json({ error: "Invalid username" });
  const user = new User({ username: username });
  user.save(function (err, newUser) {
    if (err) return console.error(err);
    res.json({ username: newUser.username, _id: newUser._id });
  });
});

app.post("/api/exercise/new-user", function (req, res) {
  const username = req.body.username;
  if (!username || username.length === 0) res.json({ error: "Invalid username" });
  const user = new User({ username: username });
  user.save(function (err, newUser) {
    if (err) return console.error(err);
    res.json({ username: newUser.username, _id: newUser._id });
  });
});

app.get ("/api/users", function (req, res) {
  User.find().select('username _id').exec(function (err, userList) {
      if (err) return console.error(err);
      res.json(userList);
    });
});

app.get ("/api/exercise/users", function (req, res) {
  User.find().select('username _id').exec(function (err, userList) {
      if (err) return console.error(err);
      res.json(userList);
    });
});

app.post("/api/exercise/add", function (req, res) {
  const userId = req.params.userId || req.body.userId;
  const obj = { 
    description: req.body.description,
    duration: +req.body.duration,
    date: req.body.date || defaultDate()
  };
  User.findByIdAndUpdate(userId, {$push: { exercises: obj } }, {new: true}, function (err, updatedUser) {
      if (err) return console.error(err);
      let returnObj = {
        username: updatedUser.username,
        description: obj.description,
        duration: obj.duration,
        _id: userId,
        date: new Date(obj.date).toDateString()
      };
      res.json(returnObj);
    }
  );
});

app.all("/api/users/:userId/exercises", function(req, res) {
  const userId = req.params.userId || req.body.userId;
  const obj = { 
    description: req.body.description,
    duration: +req.body.duration,
    date: req.body.date || defaultDate()
  };
  User.findByIdAndUpdate(userId, {$push: { exercises: obj } }, {new: true}, function (err, updatedUser) {
      if (err) return console.error(err);
      let returnObj = {
        username: updatedUser.username,
        description: obj.description,
        duration: obj.duration,
        _id: userId,
        date: new Date(obj.date).toDateString()
      };
      res.json(returnObj);
    }
  );
});

app.get("/api/exercises/:userId/log", function (req, res) {
  let userId = req.params._id;
  User.findOne({ _id: userId }, function (err, user) {
    if (err) return console.error(err);
      let exer = user.exercises
        .map(e => (
          {
            description: e.description, 
            duration: e.duration, 
            date: new Date(e.date).toDateString()
          }
          ))
        .slice(0,limit);
      let logObj = {
          count : exer.length,
          _id : user._id,
          username : user.username,
          log : exer
      };
      res.json(logObj);
  });
});

app.get("/api/users/:_id/logs", function (req, res) {
  const userId = req.params._id;
  User.findOne({ _id: userId }, function (err, user) {
    if (err) return console.error(err);
      let exer = user.exercises
        .map(e => (
          {
            description: e.description, 
            duration: e.duration, 
            date: new Date(e.date).toDateString()
          }
          ))
        .slice(0,limit);
      let obj = {
          count : exer.length,
          _id : user._id,
          username : user.username,
          log : exer
      };
      res.json(obj);
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});