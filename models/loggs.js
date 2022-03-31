const mongoose = require('mongoose')
const {Schema} = mongoose

const logSchema = new Schema({
	path: String,
	params: Object,
	body: Object,
	query: Object,
	method: String,
	status: String,
	message: String
})


module.exports = mongoose.model('Log', logSchema)