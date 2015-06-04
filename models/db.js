var mongodb = require('mongodb')
var settings = require('../settings')

var db = new mongodb.Db(
    settings.mongo.db, 
    new mongodb.Server(
      settings.mongo.host, 
      settings.mongo.port, 
      settings.mongo.opts
    ), 
    {safe: true}
)

module.exports = db

