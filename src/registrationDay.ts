import * as Crawler from 'crawler';
import * as _ from 'lodash';
import * as Https from 'https';

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
  instance.queue(_.range(600000, 604000).map(id => ({
      uri: `http://f10.eastmoney.com/f10_v2/BonusFinancing.aspx?code=sh${id}`,
      id
    })
  ));

  //深证A1
  instance.queue(_.range(300001, 300692).map(id => ({
      uri: `http://f10.eastmoney.com/f10_v2/BonusFinancing.aspx?code=sz${id}`,
      id
    })
  ));

  //深证A2
  instance.queue(
    _.chain(_.range(1, 2891))
     .reject(id => _.includes([706, 742, 747, 770, 934, 2527], id))
     .map(id => _.padStart(id, 6, '0'))
     .map(id => ({
       uri: `http://f10.eastmoney.com/f10_v2/BonusFinancing.aspx?code=sz${id}`,
       id
     }))
     .value()
  );

};

export default sendRegistrationDay;
