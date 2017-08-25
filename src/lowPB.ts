import * as Crawler from 'crawler';
import * as _ from 'lodash';
import * as Https from 'https';

import { blackList } from './constants';

const sendLowPB = () => {
  const result = {};

  const instance = new Crawler({
    maxConnections: 3,
    callback: (error, res, done) => {
      if (error) {
        console.log(error);
        done();
      }
      const $ = res.$;
      const num = $('#gt13_2').text();
      if (num < 1 && num > 0) {
        result[res.options.id] = num;
      }
      done();
    }
  });

  instance.on('drain', () => {
    const body = JSON.stringify({
      'msgtype': 'text',
      'text': {
        'content': JSON.stringify(result)
      },
      'at': {
        'atMobiles': [
          '18200391331'
        ],
        'isAtAll': false
      }
    });

    const request = Https.request({
      hostname: 'oapi.dingtalk.com',
      path: '/robot/send?access_token=7145a5aed8eef4a471ab57bcd382ebd1210811df3db8c3edbe269b375a69723c',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, res => {
      res.setEncoding('utf8');
      res.on('data', data => {
        console.log('save result', data);
      });
    });

    request.write(body);
    request.end();
  });

  //上证A
  instance.queue(
    _.chain(_.range(600000, 604000))
     .reject(id => _.includes(blackList.sh, id))
     .map(id => ({
       uri: `http://quote.eastmoney.com/sh${id}.html`,
       id
     }))
     .value()
  );

  //深证A1
  instance.queue(
    _.chain(_.range(300001, 300692))
     .reject(id => _.includes(blackList.sz, id))
     .map(id => ({
       uri: `http://quote.eastmoney.com/sz${id}.html`,
       id
     }))
     .value()
  );

  //深证A2
  instance.queue(
    _.chain(_.range(1, 2891))
     .reject(id => _.includes(blackList.sz, id))
     .map(id => _.padStart(id, 6, '0'))
     .map(id => ({
       uri: `http://quote.eastmoney.com/sz${id}.html`,
       id
     }))
     .value()
  );
};

export default sendLowPB;
