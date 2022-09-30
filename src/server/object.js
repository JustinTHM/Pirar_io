// Alle Objekte wie Schiffe , Projektile , Items, Inseln erben hiervon
class Object {
  constructor(id, x, y, dir, speed) {
    this.id = id;
    this.direction = dir;
    this.speed = speed;
    this.x = x;
    this.y = y;
  }

  //Wird einmal pro Server Tick ausgeführt
  update(dt) {
    if(this.speed !== 0){
      this.x += dt * this.speed * Math.sin(this.direction);
      this.y -= dt * this.speed * Math.cos(this.direction);
    } else {
      // Statische Objekte wie Inseln und Items bleiben unverändert
    }
    //this.speed = this.speed - 1;
  }

  // Richtung 
  setDirection(dir) {
    this.direction = dir;
  }

  //Distanz zu einem anderen Objekt berechnen
  distanceTo(object) {
    const dx = this.x - object.x;
    const dy = this.y - object.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  serializeForUpdate() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
    };
  }
}

module.exports = Object;
