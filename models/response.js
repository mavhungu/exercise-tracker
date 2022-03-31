const mongoose = require('mongoose')

const responseSchema = new mongoose.Schema({
	path: String,
	params: Object,
	body: Object,
	query: Object,
	method: String,
	response: Object
})

module.exports = mongoose.model('Response', responseSchema)