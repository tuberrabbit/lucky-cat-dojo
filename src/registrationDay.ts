import * as Crawler from 'crawler';
import * as _ from 'lodash';

import { send2DingDing } from './request';
import { buildQueue } from './utils';

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

  buildQueue(instance,
    'http://f10.eastmoney.com/f10_v2/BonusFinancing.aspx?code=sh${id}',
    'http://f10.eastmoney.com/f10_v2/BonusFinancing.aspx?code=sz${id}');
};

export default sendRegistrationDay;
