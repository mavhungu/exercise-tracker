require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const { json, urlencoded } = require('body-parser')
const mongoose = require('mongoose')
const { Schema } = mongoose;

const userSchema = new Schema({
	username: {
		type: String,
		required: true
	}
})

const responseSchema = new Schema({
	path: String,
	params: Object,
	body: Object,
	query: Object,
	method: String,
	response: Object
})

const logSchema = new Schema({
	path: String,
	params: Object,
	body: Object,
	query: Object,
	method: String,
	status: String,
	message: String
})

const exerciseSchema = new Schema({
	userId: {
		type: Schema.ObjectId,
		required: true
	},
	username: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	duration: {
		type: Number,
		required: true
	},
	date: {
		type: String,
		required: true
	}
})

const User = mongoose.model('User', userSchema)
const Exercise = mongoose.model('Exercise', exerciseSchema)
const Log = mongoose.model('Log', logSchema)
const Response = mongoose.model('Response', responseSchema)

const handleException = async (req, res, message) => {
	const PARSED_MESSAGE = message

	const errorLog = new Log({
		path: req.path,
		params: req.params,
		body: req.body,
		query: req.query,
		method: req.method,
		message: PARSED_MESSAGE
	})

	await errorLog.save()

	return res.send(PARSED_MESSAGE)
};

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: false }))
app.use(express.static('public'))

/*app.use('/api/users/:_id/logs',({ method, url, query, params, body }, res, next) => {
	console.log('>>> ', method, url);
	console.log(' QUERY:', query);
	console.log(' PRAMS:', params);
	console.log('  BODY:', body);
	const _json = res.json;
	res.json = function (data) {
	  console.log(' RESLT:', JSON.stringify(data, null, 2));
	  return _json.call(this, data);
	};
	console.log(' ----------------------------');
	next();
  });
*/
app.get('/', async (req, res) => {
	res.sendFile(__dirname + '/views/index.html')
});

app.get('/healthcheck', async (req, res) => {
	res.send({ message: 'OK' });
})

app.get('/api/users', async (req, res) => {
	try {
		const allUsers = await User.find().select('_id username');

		res.send(allUsers);
	} catch (error) {
		await handleException(req, res, error.message)
	}
})

app.post('/api/users', async (req, res) => {
	try {
		const { username } = req.body;
		const { _id } = await User.create({ username });

		res.json({ _id, username });
	} catch (error) {
		await handleException(req, res, error.message)
	}
})

app.post('/api/users/:_id/exercises', async (req, res) => {
	try {
		const { _id } = req.params;
		const { description } = req.body;
		const DURATION_INT = parseInt(req.body.duration, 10);
		const REQ_BODY_DATE = new Date(req.body.date);
		const DEFAULT_DATE = new Date().toDateString();
		const DATE_STRING = (!isNaN(REQ_BODY_DATE) && REQ_BODY_DATE.toDateString()) || DEFAULT_DATE;

		const { username } = await User.findById({ _id });
		const { duration, date } = await Exercise.create({
			userId: _id,
			username,
			description,
			duration: DURATION_INT,
			date: DATE_STRING
		});

		res.json({ _id, username, description, duration, date });
	} catch (error) {
		await handleException(req, res, error)
	}
})

app.get('/api/users/:_id/logs', async (req, res) => {
	const { _id } = req.params;
  if (_id.length !== 24) {
    return res.json({ error: "User ID needs to be 24 hex characters" });
  }

  // find the user
  getUserByIdAnd(_id, (userObject) => {
    if (userObject === null) res.json({ error: "User not found" });
    else {
      const limit = req.query.limit ? req.query.limit : 0;

      // find the user's activities
      let promise = ExerciseActivity.find({ user_id: _id }).exec();
      assert.ok(promise instanceof Promise);
      promise.then((exerciseObjects) => {
        // apply from
        if (req.query.from) {
          const from = new Date(req.query.from);
          exerciseObjects = exerciseObjects.filter(
            (e) => new Date(e.date).getTime() >= from.getTime()
          );
        }
        // apply to
        if (req.query.to) {
          const to = new Date(req.query.to);
          exerciseObjects = exerciseObjects.filter(
            (e) => new Date(e.date).getTime() <= to.getTime()
          );
        }
        // apply limit
        if (req.query.limit) exerciseObjects = exerciseObjects.slice(0, req.query.limit);

        // change date to DateString
        exerciseObjects = exerciseObjects.map((e) => ({
          description: e.description,
          duration: e.duration,
          date: new Date(e.date).toDateString(),
        }));

        res.json({
          _id: userObject._id,
          username: userObject.username,
          count: exerciseObjects.length,
          log: exerciseObjects,
        });
      });
    }
  });
})

const listener = app.listen(process.env.PORT || 3000, () => {
	console.log('Your app is listening on port ' + listener.address().port)
})

/*module.exports = {
	app,
	User
};*/