const ObjectClass = require('./object');
const Bullet = require('./bullet');
const Constants = require('../shared/constants');

class Player extends ObjectClass {
  constructor(id, username, x, y) {
    super(id, x, y, Math.random() * 2 * Math.PI, Constants.PLAYER_SPEED); // Zufällige richtung
    this.username = username; // Vom Nutzer eingegebener Name
    this.hp = Constants.PLAYER_MAX_HP; // Leben
    this.fireCooldown = 0; // Schießen
    this.score = 0; // Score fürs Leaderbord und Boot upgrades
    this.boatlvl = 1; // Connon Upgrades
    this.shootBoostTimer = 0;
  }

  // Gibt geschossenen Kugeln zurück oder nichts .
  update(dt) {
    super.update(dt);

    // Update score
    this.score += dt * Constants.SCORE_PER_SECOND;

    // Spieler ist in der Map
    this.x = Math.max(0, Math.min(Constants.MAP_SIZE, this.x));
    this.y = Math.max(0, Math.min(Constants.MAP_SIZE, this.y));


    //Boost
    this.shootBoostTimer -= dt;

    // Schieß eine Welle von Kugeln wenn firecooldown es zulässt
    this.fireCooldown -= dt;
    if (this.fireCooldown <= 0) {
      if(this.shootBoostTimer <= 0){
        this.fireCooldown += Constants.PLAYER_FIRE_COOLDOWN; //Standart Feuer rate
        this.shootBoostTimer = 0;
      }else{
        this.fireCooldown += (Constants.PLAYER_FIRE_COOLDOWN / 2); //Boost Feuer rate
      }
      //this.fireCooldown += Constants.PLAYER_FIRE_COOLDOWN;
      var bullets  = [];
      const direc = this.direction;

      //Lvl 0 - Start
      //Lvl 1 - 300
      //Lvl 2 - 600
      //Lvl 3 - 1000
      const score = this.score;
      //console.log(score);

      if(score >= 1000){
        this.boatlvl = 3;
        var bullet1 = new Bullet(this.id, this.x, this.y, ( direc + (2.8 / 2)));
        var bullet2 = new Bullet(this.id, this.x, this.y, ( direc - (2.8 / 2)));
        var bullet3 = new Bullet(this.id, this.x, this.y, ( direc + (2.8 / 3)));
        var bullet4 = new Bullet(this.id, this.x, this.y, ( direc - (2.8 / 3)));
        var bullet5 = new Bullet(this.id, this.x, this.y, ( direc + (2.8 / 4)));
        var bullet6 = new Bullet(this.id, this.x, this.y, ( direc - (2.8 / 4)));
        bullets = [bullet1,bullet2,bullet3,bullet4,bullet5,bullet6];

      }else if(score >= 600){
        var bullet1 = new Bullet(this.id, this.x, this.y, ( direc + (2.8 / 2)));
        var bullet2 = new Bullet(this.id, this.x, this.y, ( direc - (2.8 / 2)));
        var bullet3 = new Bullet(this.id, this.x, this.y, ( direc + (2.8 / 3)));
        var bullet4 = new Bullet(this.id, this.x, this.y, ( direc - (2.8 / 3)));
        bullets = [bullet1,bullet2,bullet3,bullet4];
      }else if(score >= 300){
        this.boatlvl = 1; // Für richtiges Rendern beim client
        var bullet1 = new Bullet(this.id, this.x, this.y, ( direc + 1.5));
        var bullet2 = new Bullet(this.id, this.x, this.y, ( direc - 1.5));
        bullets = [bullet1,bullet2];
      }else if(score < 300){
        var bullet1 = new Bullet(this.id, this.x, this.y, ( direc ));
        bullets = [bullet1];
      }
      console.log(direc);
      return bullets;
    }

    return null;
  }

  // Schiff wurde angeschossen
  takeBulletDamage() {
    this.hp -= Constants.BULLET_DAMAGE;
  }

  // Schiff Reparieren 
  takeRepairBoost() {
    if(this.hp + Constants.REPAIR_BOOST > Constants.PLAYER_MAX_HP){
      this.hp = Constants.PLAYER_MAX_HP;
    }else{
      this.hp += Constants.REPAIR_BOOST;
    }
  }

  //Score erhöhen
  takeCoins(count){
    this.score += count || 1;
  }

  takeDamage(damage = 1) {
    this.hp -= damage;
  }

  //Schneller schießen für X sekunden
  takeShootBoost(sec = 20){
    this.shootBoostTimer += sec;
  }

  // Player kriegt den Score des erschossenen Spielers
  onDealtDamage() {
    this.score += Constants.SCORE_BULLET_HIT;
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()), // Ort
      direction: this.direction, // Richtung
      hp: this.hp, //Lebensanzeige
      boatlvl: this.boatlvl // für Bilder rendering
    };
  }
}

module.exports = Player;
