var mongodb = require('./db')
var moment = require('moment')

function Content(content, target_url, author, author_url, pub_time, keyword, addr, key_level, attent_vehicle, floor) {
  this.content = content
  this.target_url = target_url
  this.author = author
  this.author_url = author_url
  this.pub_time = pub_time
  this.keyword = keyword
  this.addr = addr
  this.key_level = key_level
  this.attent_vehicle = attent_vehicle
  this.floor = floor
}

module.exports = Content

Content.get = function(params, callback) {
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err)
    }

    db.collection('bbs_contents', function(err, collection) {
      if (err) {
        mongodb.close()
        return callback(err)
      }
      var query = {}
      if (params.addr)
        query.addr = {'$regex': params.addr}
      limit = 0
      if (params.pageSize)
        limit = params.pageSize

      collection.find(query).sort({pub_time: -1, key_level: 1}).limit(limit).toArray(function(err, docs) {
        mongodb.close()
        if (err) {
          callback(err, null)
        }

        var contents = []
        docs.forEach(function(doc, index) {
          var content = new Content(doc.content, doc.target_url, doc.author, doc.author_url, doc.pub_time.toUTCString(), doc.keyword, doc.addr, doc.key_level, doc.attent_vehicle, doc.floor)
          contents.push(content)
        })
        callback(null, contents)
      })
    })
  }) 
}

// Thu Jun 11 2015 18:48:06 GMT+0800 (CST)