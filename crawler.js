const crawler = require('crawler');
const _ = require('lodash');
const fs = require('fs');
const https = require('https');

const result = {};

const instance = new crawler({
  maxConnections: 3,
  callback: function (error, res, done) {
    if (error) {
      console.log(error);
      done();
    }
    const $ = res.$;
    const num = $("#gt13_2").text();
    if (num < 1 && num > 0) {
      result[res.options.id] = num;
    }
    done();
  }
});

instance.on('drain', function () {
  const body = JSON.stringify({
    "msgtype": "text",
    "text": {
      "content": JSON.stringify(result)
    },
    "at": {
      "atMobiles": [
        "18200391331"
      ],
      "isAtAll": false
    }
  });

  const request = https.request({
    hostname: "oapi.dingtalk.com",
    path: "/robot/send?access_token=7145a5aed8eef4a471ab57bcd382ebd1210811df3db8c3edbe269b375a69723c",
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  }, function (res) {
    res.setEncoding('utf8');
    res.on('data', function (data) {
      console.log('save result', data);
    });
  });

  request.write(body);
  request.end();
});

//上证A
instance.queue(_.range(600000, 604000).map(function (id) {
  return {
    uri: 'http://quote.eastmoney.com/sh' + id + '.html',
    id: id
  }
}));

//深证A1
instance.queue(_.range(300001, 300692).map(function (id) {
  return {
    uri: 'http://quote.eastmoney.com/sz' + id + '.html',
    id: id
  }
}));

//深证A2
instance.queue(
  _.chain(_.range(000001, 002891))
    .reject(function (id) {
      return _.includes(
        [706, 742, 747, 770, 934, 2527], id);
    })
    .map(function (id) {
      const padId = _.padStart(id, 6, '0');
      return {
        uri: 'http://quote.eastmoney.com/sz' + padId + '.html',
        id: padId
      }
    })
    .value()
);

// instance.queue([{
//   uri: 'http://quote.eastmoney.com/sh603999.html',
//   id: 603999
// }]);
