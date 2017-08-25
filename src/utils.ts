import * as _ from 'lodash';

import { blackList } from './constants';

export const buildQueue = (instance, shUri, szUri) => {
  //上证A
  instance.queue(
    _.chain(_.range(600000, 604000))
     .reject(id => _.includes(blackList.sh, id))
     .map(id => ({
       uri: shUri.replace(/\$\{id\}/i, id),
       id
     }))
     .value()
  );

  //深证A1
  instance.queue(
    _.chain(_.range(300001, 300692))
     .reject(id => _.includes(blackList.sz, id))
     .map(id => ({
       uri: szUri.replace(/\$\{id\}/i, id),
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
       uri: szUri.replace(/\$\{id\}/i, id),
       id
     }))
     .value()
  );
};
