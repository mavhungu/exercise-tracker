const Errorhandle = async (req, res, message) => {
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

module.exports = Errorhandle;