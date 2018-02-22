export default class CalypearDiagramComponent {
  constructor(data) {
    //Set the defaults

    //Assign settings from the options
    Object.assign(this,data);
    this.x = 1;
    this.y = 1;
  }

  get isPinned() {
    return this._pinned;
  }

  putAt() {
    this.fx = x;
    this.fy = y;

    return this;
  }

  pinAt(x,y) {
    this.holdAt(x,y);

    if (x || y) {
      this._pinned = true;
    } else {
      this._pinned = false;
    }
    return this;
  }

  pinRelease() {
    this.pinAt(null,null);

    return this;
  }

  isPinned(){
    return this._pinned;
  }
}
