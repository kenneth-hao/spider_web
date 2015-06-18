var express = require('express');
var router = express.Router();
var BbsContent = require('../proxy/bbscontent');
var xlsx = require('node-xlsx');
var urlencode = require('urlencode');
var moment = require('moment');
var validator = require('validator');
var eventproxy = require('eventproxy');
var _ = require('underscore');

/* GET home page. */
router.get('/', function(req, res) {
  page = parseInt(req.query.page, 10) || 1;
  page = page > 0 ? page : 1;

  var limit = 50;
  var opts = {skip: (page-1) * limit, limit: limit, sort: '-pub_time'};

  var proxy = new eventproxy();

  var query = {};

  if (req.query.addr && req.query.addr !== '全国') {
    query['addr'] = new RegExp(req.query.addr);
  }

  BbsContent.getCountByQuery(query, proxy.done("totalCount", function(totalCount) {
      return totalCount;
  }));

  BbsContent.getContentsByQuery(query, opts, proxy.done("contents", function(contents) {
    return contents;
  }));

  BbsContent.getCountByQuery(query, proxy.done("pages", function(all_contents_count) {
    var pages = Math.ceil(all_contents_count / limit);
    return pages;
  }));

  proxy.all("contents", "totalCount", "pages", function(contents, totalCount, pages) {
    var keywords = [];

    contents.forEach(function(c) {
      if (_.contains(keywords, c.keyword) === false) {
        keywords.push(c.keyword);
      }
    });

    po = {};
    po.current_page = page;
    po.pages = _.range(1, pages+1);

    res.render('index', {
      title: '汽车之家论坛爬取数据集',
      contents: contents,
      keywords: keywords,
      totalCount: totalCount,
      query: req.query,
      po: po,
    });
  });

});

router.get('/export', function(req, res) {
  var query = {},
    opts = {};
  if (req.query.addr && req.query.addr !== '全国') {
    query['addr'] = new RegExp(req.query.addr);
  }

  var proxy = new eventproxy();

  BbsContent.getContentsByQuery(query, opts, proxy.done("contents", function(contents) {
    return contents;
  }));
  
  proxy.all("contents", function(contents) {
    var data = [
      ['总记录数: ' + contents.length],
      ['内容', '内容URL', '内容所在楼层', '发表人', '发表人所在地', '发表人主页', '发表时间', '关键词', '关键词级别', '关注车系'],
    ];
    
    contents.forEach(function(c, i) {
      var d = [c.content, c.target_url, c.floor, c.author, c.addr, c.author_url, moment.utc(c.pub_time).format('YYYY-MM-DD HH:mm:ss'), c.keyword, c.key_level, c.attent_vehicle];
      data.push(d);
    });

    var buffer = xlsx.build([{name: "汽车之家论坛内容", data: data}]); // returns a buffer
    
    res.setHeader('Content-Description', 'File Transfer');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8');
    var userAgent = (req.headers['user-agent']||'').toLowerCase();
    var filename = '汽车之家论坛内容爬取结果_' + moment().format('YYYYMMDD.HHmm') + '.xlsx';
    if (userAgent.indexOf('msie') >= 0 || userAgent.indexOf('chrome') >= 0) {
    res.setHeader('Content-Disposition', 'attachment; filename=' + urlencode(filename));
    } else if (userAgent.indexOf('firefox') >= 0) {
      res.setHeader('Content-Disposition', 'attachment; filename*=' + urlencode(filename));
    } else {
      res.setHeader('Content-Disposition', 'attachment; filename=' + urlencode(filename));
    }
    res.setHeader('Expires', 0);
    res.setHeader('Cache-Control', 'must-revalidate');

    res.send(buffer);
  });

});

module.exports = router;
