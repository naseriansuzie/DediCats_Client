import AuthStore from './AuthStore';
import CatStore from './CatStore';
import HelperStore from './HelperStore';
import MapStore from './MapStore';
import PostStore from './PostStore';
import ReportStore from './ReportStore';
import UserStore from './UserStore';

class RootStore {
  constructor() {
    this.auth = new AuthStore(this);
    this.cat = new CatStore(this);
    this.helper = new HelperStore(this);
    this.map = new MapStore(this);
    this.post = new PostStore(this);
    this.report = new ReportStore(this);
    this.user = new UserStore(this);
  }
}

export default RootStore;
