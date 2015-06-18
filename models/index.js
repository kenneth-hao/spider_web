var mongoose = require('mongoose')
var settings = require('../settings')

mongoose.connect(settings.mongo.db, function (err) {
    if (err) {
        console.error('connect to %s error: ', settings.mongo.db, err.message)
        process.exit(1)
    }
})

require('./bbscontent')

exports.BbsContent = mongoose.model('BbsContent')