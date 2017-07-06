const LookupType = require('./lookuptype');

class ComponentType  {
  constructor (name, id = null) {
    this.id = id;
    this.name = name;
    this.category = 'component';
  }

}

module.exports = ComponentType;
