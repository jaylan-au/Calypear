export default class CalypearDiagramComponent {
  constructor(data) {
    //Set the defaults

    //Assign settings from the options
    Object.assign(this,data);
  }

  get isPinned() {
    return this._pinned;
  }


  putAt(x,y) {
    this.fx = x;
    this.fy = y;

    return this;
  }

  pinAt(x,y) {
    this.putAt(x,y);

    if (x || y) {
      this._pinned = true;
    } else {
      this._pinned = false;
    }
    return this;
  }

  pinAtPosition() {
    this.pinAt(this.x,this.y);
  }

  putRelease() {
    this.putAt(null,null);
  }

  pinRelease() {
    this.pinAt(null,null);

    return this;
  }

  isPinned(){
    return this._pinned;
  }
}
