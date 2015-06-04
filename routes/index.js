var express = require('express');
var router = express.Router();
var Content = require('../models/content')
var xlsx = require('node-xlsx');
var urlencode = require('urlencode')
var moment = require('moment')

/**
 * Array.prototype.[method name] allows you to define/overwrite an objects method
 * needle is the item you are searching for
 * this is a special variable that refers to "this" instance of an Array.
 * returns true if needle is in the array, and false otherwise
 * 
 */
Array.prototype.contains = function ( needle ) {
  for (i in this) {
    if (this[i] == needle) return true;
  }
  return false;
}

/* GET home page. */
router.get('/', function(req, res) {
  Content.get(null, function(err, contents) {
    if (err) {
      contents = []
    }

    var keywords = []
    
    contents.forEach(function(c, i) {
      if (keywords.contains(c.keyword) === false) {
        keywords.push(c.keyword)
      }
    })

    res.render('index', {
      title: 'Spider >> Autohome BBS Data',
      contents: contents,
      keywords: keywords
    })
  })
})

router.get('/export', function(req, res) {
  Content.get(null, function(err, contents) {
    if (err) {
      contents = []
    }

    var keywords = []
    
    contents.forEach(function(c, i) {
      if (keywords.contains(c.keyword) === false) {
        keywords.push(c.keyword)
      }
    })

    var data = [
      ['总记录数: ' + contents.length],
      ['关键词: ' + keywords],
      ['内容', '内容URL', '内容所在楼层', '发表人', '发表人所在地', '发表人主页', '发表时间', '关键词', '关键词级别', '关注车系'],
    ]

    
    contents.forEach(function(c, i) {
      var d = [c.content, c.target_url, c.floor, c.author, c.addr, c.author_url, c.pub_time, c.keyword, c.key_level, c.attent_vehicle]
      data.push(d)
    })

    var buffer = xlsx.build([{name: "汽车之家论坛内容", data: data}]); // returns a buffer
    
    res.setHeader('Content-Description', 'File Transfer')
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8')
    var userAgent = (req.headers['user-agent']||'').toLowerCase()
    var filename = '汽车之家论坛内容爬取结果_' + moment().format('YYYY-MM-DD') + '.xlsx'
    if (userAgent.indexOf('msie') >= 0 || userAgent.indexOf('chrome') >= 0) {
    res.setHeader('Content-Disposition', 'attachment; filename=' + urlencode(filename))
    } else if (userAgent.indexOf('firefox') >= 0) {
      res.setHeader('Content-Disposition', 'attachment; filename*=' + urlencode(filename))
    } else {
      res.setHeader('Content-Disposition', 'attachment; filename=' + urlencode(filename))
    }
    res.setHeader('Expires', 0)
    res.setHeader('Cache-Control', 'must-revalidate')

    res.send(buffer)
  })
})

module.exports = router;
