import CatStore from './CatStore';
import UserStore from './UserStore';

class RootStore {
  constructor() {
    this.cat = new CatStore(this);
    this.user = new UserStore(this);
  }
}

export default RootStore;
