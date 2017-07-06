const RelationshipType = require('relationshiptype');

class ComponentRelationship {
  constructor (from, relationship, to, transactionId = null, id = null) {
    this.id = id
    this.from = from;
    this.to = to;
    this.relationship = relationship;
    this.transactionId = transactionId;
  }

  get forwardDescription() {
    return this;
  }

  get reverseDescription() {
    //return a new relationship that is an inverse of this
    return new ComponentRelationship(this.to,this.relationship.inverseName,this.from,this.transactionId)
  }
}

module.exports = RelationshipType;
