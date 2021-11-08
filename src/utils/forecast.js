const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=f0b539bf9b092c22feed97fad2a8b75c&query=' + latitude + ',' + longitude + '&units=f'

    request({ url: url, json: true}, (error, {body}) => {
        if (error) {
            callback('Unable to connect to weather service.')
        } else if (body.error) {
            callback('Unable to find location.')
        } else {
            const description = body.current.weather_descriptions[0]
            const temp = body.current.temperature
            const precip = body.current.precip * 100
            const  humidity = body.current.humidity
            callback(undefined, {
                description: description, 
                temp: temp,
                precip: precip,
                humidity: humidity
            })
        }
    })
}

module.exports = forecast