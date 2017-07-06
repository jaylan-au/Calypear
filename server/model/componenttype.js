const LookupType = require('lookuptype');

class ComponentType extends LookupType {
  constructor (name, id = null) {
    this.id = id;
    this.name = name;
    this.category = 'component';
  }

}

module.exports = ComponentType;
