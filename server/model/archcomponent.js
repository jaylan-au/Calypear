class ArchComponent {
  constructor (name, id = null) {
    this.id = id;
    this.name = name;
    this.componentType = null;
    this.relationships = [];
  }
}

module.exports = ArchComponent;
