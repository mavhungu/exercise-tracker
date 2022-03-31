require('dotenv').config()
require('./models/db')
const express = require('express')
const path = require('path')
const cors = require('cors')
const hbs = require('hbs')
const {json, urlencoded} = require('body-parser')

const home = require('./router/home')
const suers = require('./router/users')

const app = express()
const port = process.env.PORT || 3001

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname,'templates/views'))
hbs.registerPartials(path.join(__dirname,'templates/partials'))

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname,'public')))


app.use('/api/users/:_id/logs',({ method, url, query, params, body }, res, next) => {
	console.log('', method, url);
	console.log(' QUERY:', query);
	console.log(' PRAMS:', params);
	console.log(' BODY:', body);
	const _json = res.json;
	res.json = function (data) {
	  console.log(' RESLT:', JSON.stringify(data, null, 2));
	  return _json.call(this, data);
	};
	next();
});

app.use('/',home)
app.use('/healthcheck',home)
app.use('/api/users', suers)

app.get('*', (req, res) => {
    res.status(404).send('Not found');
})


app.listen(port,() => {
    console.log(`Up and running on port ${port}`)
})