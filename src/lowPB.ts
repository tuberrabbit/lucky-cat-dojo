import * as Crawler from 'crawler';
import * as _ from 'lodash';
import * as Https from 'https';
import * as fs from 'fs';

import { blackList } from './constants';
import { send2DingDing } from 'request';

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
    let lastResult = {};
    fs.readFile('./lastLowPB.json', (err, data) => {
      if (err) {
        return console.log(err);
      }
      lastResult = data;
    });

    fs.writeFile('./lastLowPB.json', result, err => {
      if (err) {
        return console.log(err);
      }
    });

    const increasedResult = _.reduce(result, (diffResult, value, key) => {
      if (!lastResult[key]) {
        diffResult[key] = value;
      }
      return diffResult;
    }, {});

    const subtractedResult = _.reduce(lastResult, (diffResult, value, key) => {
      if (!result[key]) {
        diffResult[key] = value;
      }
      return diffResult;
    }, {});

    send2DingDing({ increasedResult, subtractedResult });
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
