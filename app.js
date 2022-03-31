require('dotenv').config()
require('./models/db')
const express = require('express')
const path = require('path')
const cors = require('cors')
const hbs = require('hbs')

const home = require('./router/home')

const app = express()
const port = process.env.PORT || 3001

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname,'templates/views'))
hbs.registerPartials(path.join(__dirname,'templates/partials'))

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname,'public')))


app.use('/',home)


app.get('*', (req, res) => {
    res.status(404).send('Not found');
})


app.listen(port,() => {
    console.log(`Up and running on port ${port}`)
})