import * as Https from 'https';

export const send2DingDing = data => {
  const body = JSON.stringify({
    'msgtype': 'text',
    'text': {
      'content': JSON.stringify(data)
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
};
