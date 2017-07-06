const LookupType = require('lookuptype');

class RelationshipType extends LookupType {
  constructor (name, inverseName, id = null) {
    this.id = id;
    this.name = name;
    this.inverseName = inverseName;
    this.category = 'relationship';
  }

}

module.exports = RelationshipType;
