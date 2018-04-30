import DateStore from 'nedb'
import path from 'path'
import {remote} from 'electron'


const dbs = {
  records: new DateStore({
    autoload: true,
    filename: path.join(remote.app.getAppPath(), '/../data/data.db')
  }),
  settings: new DateStore({
    autoload: true,
    filename: path.join(remote.app.getAppPath(), '/../data/settings.db')
  })
};
export default dbs;
