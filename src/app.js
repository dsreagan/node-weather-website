const path = require('path')
const express = require('express')
const hbs= require('hbs')
const forecast = require('./utils/forecast')
const geocode = require('./utils/geocode')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Daniel Reagan'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Daniel Reagan'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        message: 'How can I help?',
        title: 'Help', 
        name: 'Daniel Reagan'
    })
})

 app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Must provide a valid address.'
        })
    }
    
    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, {description, temp, precip, humidity}) =>{
            if (error) {
                return res.send({ error })
            }

            res.send({
                location: location,
                forecast: `${description} with a current temperature of ${temp} F, a humidity of ${humidity}%, and a ${precip}% chance of rain.`
            })
        })
    })

})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term.'
        })
    }

    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMessage: 'Help article not found.',
        name: 'Daniel Reagan'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMessage: 'Page not found.', 
        name: 'Daniel Reagan'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})