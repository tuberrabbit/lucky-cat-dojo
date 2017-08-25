import * as Crawler from 'crawler';
import * as _ from 'lodash';
import * as fs from 'fs';

import { send2DingDing } from 'request';
import { buildQueue } from './utils';

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

  buildQueue(instance,
    'http://quote.eastmoney.com/sh${id}.html',
    'http://quote.eastmoney.com/sz${id}.html');
};

export default sendLowPB;
