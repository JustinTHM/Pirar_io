const shortid = require('shortid');
const ObjectClass = require('./object');
const Constants = require('../shared/constants');

class StaticObject extends ObjectClass {


  constructor(itemClass,x,y) {
    super(shortid(),x, y, 0, 0);
    this.itemClass = itemClass;
  }

  // true wenn Objekt zestört werden soll
  update(dt) {
    super.update(dt);
    return this.x < 0 || this.x > Constants.MAP_SIZE || this.y < 0 || this.y > Constants.MAP_SIZE;
  }



serializeForUpdate() {
  return {
    ...(super.serializeForUpdate()), // Ort
    itemClass: this.itemClass
  };
}


}

module.exports = StaticObject;
