const path = require('path');
const express = require('express')
const hbs = require('hbs')
const songquiz = require('./utils/songquiz.js')

console.log(__dirname)
console.log(path.join(__dirname, '../public'))

const app = express()

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname,"../templates/views")
const partialsPath = path.join(__dirname, "../templates/partials")

//Setup  handlebars engine and views location
//customize server
//define template
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Setup static directory location
app.use(express.static(publicDirectoryPath))

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Gerak'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Gerak'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        message: 'You dont need my help, you can do it alone.',
        title: 'Help',
        name: 'Gerak'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address){
        return res.send({
            error:'Address must be provided'})
    }
    geocode(req.query.address, (error, {latitude, longitude, location}) => {
        if (error){
            return res.send({error})
        } 
        forecast(latitude, longitude, (error, forecastData) => {
            if (error){
                return res.send({error})
            }
            res.send({
                forecast: forecastData,
                location: location,
                address: req.query.address
            })
        }) 
    })
    
})

app.get('/help/*', (req, res) => {
    //res.send('Help article not found')
    res.render('error', {
        errorMessage: 'Help article not found',
        title: '404',
        name: 'Gerak'
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('*', (req, res) => {
    //res.send('My 404 page')
    res.render('error', {
        errorMessage: 'Page not found',
        title: '404',
        name: 'Gerak'
    })
})


app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})

