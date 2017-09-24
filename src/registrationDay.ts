import * as Crawler from 'crawler';
import * as _ from 'lodash';

import { send2DingDing } from './request';
import { buildQueue } from './utils';

const sendRegistrationDay = () => {
  const result = {};
  const err = {};

  const instance = new Crawler({
    maxConnections: 1,
    jQuery: false,
    callback: (error, res, done) => {
      console.log(res.options.id);
      if (error) {
        err[res.options.id] = res.options.uri;
        done();
      }

      const data = _.get(JSON.parse(res.body), 'Result.fhyx', []);
      _.forEach(data, item => {
        if (new Date(item.gqdjr) > new Date()) {
          result[res.options.id] = item.gqdjr;
          return false;
        }
      });

      done();
    }
  });

  instance.on('drain', () => {
    console.log(err);
    send2DingDing(result);
  });

  buildQueue(instance,
    'http://emweb.securities.eastmoney.com/PC_HSF10/BonusFinancing/BonusFinancingAjax?code=sh${id}',
    'http://emweb.securities.eastmoney.com/PC_HSF10/BonusFinancing/BonusFinancingAjax?code=sz${id}');
};

export default sendRegistrationDay;
