import * as Crawler from 'crawler';
import * as _ from 'lodash';
import * as Https from 'https';

import { blackList } from './constants';
import { send2DingDing } from './request';

const sendRegistrationDay = () => {
  const result = {};

  const instance = new Crawler({
    maxConnections: 3,
    callback: (error, res, done) => {
      if (error) {
        console.log(error);
        done();
      }

      const $ = res.$;
      _.forEach($('.registrationDay'), item => {
        if (new Date($(item).text()) > new Date()) {
          result[res.options.id] = $(item).text();
          return false;
        }
      });

      done();
    }
  });

  instance.on('drain', () => {
    send2DingDing(result);
  });

  //上证A
  instance.queue(
    _.chain(_.range(600000, 604000))
     .reject(id => _.includes(blackList.sh, id))
     .map(id => ({
       uri: `http://f10.eastmoney.com/f10_v2/BonusFinancing.aspx?code=sh${id}`,
       id
     }))
     .value()
  );

  //深证A1
  instance.queue(
    _.chain(_.range(300001, 300692))
     .reject(id => _.includes(blackList.sz, id))
     .map(id => ({
       uri: `http://f10.eastmoney.com/f10_v2/BonusFinancing.aspx?code=sz${id}`,
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
       uri: `http://f10.eastmoney.com/f10_v2/BonusFinancing.aspx?code=sz${id}`,
       id
     }))
     .value()
  );

};

export default sendRegistrationDay;
