const errorhandle = require('../middleware/errorhandle')

const userscontroller = async (req, res)=>{
    try {
		const allUsers = await User.find().select('_id username');
		res.render('index',{
            'title': 'Exercise Tracker | mavhungu Ronewa',
            'home': 'Exercise tracker',
            allUsers
        });
	} catch (error) {
		await errorhandle(req, res, error.message)
	}
}

const postuserscontroller = async (req, res)=>{
    try {
		const { username } = req.body;
		const { _id } = await User.create({ username });
		res.json({ _id, username });
	} catch (error) {
		await errorhandle(req, res, error.message)
	}
}

const exercisescontroller = async (req, res)=>{

}

const logscontroller = async (req,res)=>{
    try {
		const { _id } = req.params;
		const FROM_DATE = new Date(req.query.from)
		const TO_DATE = new Date(req.query.to)
		const FROM_TIMESTAMP = !isNaN(FROM_DATE) && FROM_DATE.getTime()
		const TO_TIMESTAMP = !isNaN(TO_DATE) && TO_DATE.getTime()
		const LIMIT_INT = parseInt(req.query.limit, 10)
		const FIND_OPTIONS = { userId: _id }
		const SELECT_OPTIONS = { _id: 0, duration: 1, date: 1, description: 1 }
		const { username } = await User.findById({ _id })
		const filterByDateRange = ({ date }) =>
			new Date(date).getTime() >= FROM_TIMESTAMP && new Date(date).getTime() <= TO_TIMESTAMP
		let log;
		if (FROM_TIMESTAMP && TO_TIMESTAMP && !!LIMIT_INT && LIMIT_INT > 0) {
			log = await Exercise
				.find(FIND_OPTIONS)
				.select(SELECT_OPTIONS)
				.limit(LIMIT_INT)
			log = log.filter(filterByDateRange)
		} else if (FROM_TIMESTAMP && TO_TIMESTAMP && !LIMIT_INT) {
			log = await Exercise
				.find(FIND_OPTIONS)
				.select(SELECT_OPTIONS)
			log = log.filter(filterByDateRange)
		} else if (!FROM_TIMESTAMP && !TO_TIMESTAMP && !!LIMIT_INT && LIMIT_INT > 0) {
			log = await Exercise
				.find(FIND_OPTIONS)
				.select(SELECT_OPTIONS)
				.limit(LIMIT_INT)
		} else {
			log = await Exercise
				.find(FIND_OPTIONS)
				.select(SELECT_OPTIONS)
		}
		const count = log.length
		let baseResponse = { }
		if (FROM_DATE.toDateString() !== 'Invalid Date') {
			baseResponse.from = FROM_DATE.toDateString()
		}
		if (TO_DATE.toDateString() !== 'Invalid Date') {
			baseResponse.to = TO_DATE.toDateString()
		}
		baseResponse = { _id, username, ...baseResponse, count, log }
		await Response.create({
			path: req.path,
			params: req.params,
			body: req.body,
			query: req.query,
			method: req.method,
			response: baseResponse
		})
		res.json(baseResponse)
	} catch (error) {
		await HandleErrors(req, res, error.message)
	}
}

module.exports= {
    userscontroller,
    postuserscontroller,
    exercisescontroller,
    logscontroller
}