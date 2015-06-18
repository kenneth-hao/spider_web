var models = require('../models');
var BbsContent = models.BbsContent;

exports.getCountByQuery = function(query, cb) {
    BbsContent.count(query, cb);
}

exports.getContentsByQuery = function(query, opt, cb) {
  BbsContent.find(query, {}, opt, function(err, contents) {
    console.log(contents.length)
    if (err) {
      return cb(err);
    }
    if (contents.length === 0) {
      return cb(null, []);
    }

    return cb(null, contents);
  })
}