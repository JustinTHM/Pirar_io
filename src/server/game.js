const Constants = require('../shared/constants');
const Player = require('./player');
const applyCollisions = require('./collisions');
const staticObject = require('./staticObject');
var itemTimer = 0;

class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    this.bullets = [];
    this.staticObjects = [];
    this.lastUpdateTime = Date.now();
    this.shouldSendUpdate = false;
    setInterval(this.update.bind(this), 1000 / 60);
  }

  addPlayer(socket, username) {
    this.sockets[socket.id] = socket;

    // Zufällige Posistion
    const x = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
    const y = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
    this.players[socket.id] = new Player(socket.id, username, x, y);
  }

  removePlayer(socket) {
    delete this.sockets[socket.id];
    delete this.players[socket.id];
  }

  handleInput(socket, dir) {
    if (this.players[socket.id]) {
      this.players[socket.id].setDirection(dir);
    }
  }


  async updateMap(){
      //Inseln und Items generieren
      //itemTimer++;
      //itemTimer = 0;
      console.log("[Karten Update]");

      
      if(this.staticObjects.length < 100){
        // 1 Insel
        // 2 Repair
        var i = 0;

        do {
          i++;
          var r = Math.floor(Math.random() * 4 + 0.9);
          var itemx = Math.floor(Math.random() * Constants.MAP_SIZE);
          var itemy = Math.floor(Math.random() * Constants.MAP_SIZE);
          var newObj = new staticObject(r, itemx, itemy);
          var newObjArr = [newObj];
          var removedItems = applyCollisions(Object.values(newObjArr), this.staticObjects, "default", 200 , 200);
          //var test = this.staticObjects.filter(staticObjects => !removedItems.includes(staticObjects));
  
          console.log(removedItems.length + " - " + this.staticObjects.length + "X:" + itemx + " Y:" + itemy + "Klasse:" + r);





        } while (removedItems.length > 0 && i < 6);
        if(i < 6){
          this.staticObjects.push(new staticObject(r, itemx, itemy));
        }

/*
        var r = Math.floor(Math.random() * 4 + 0.9);
        



        var itemx = Math.floor(Math.random() * Constants.MAP_SIZE);
        var itemy = Math.floor(Math.random() * Constants.MAP_SIZE);
        var newObj = new staticObject(r, itemx, itemy);
        var newObjArr = [newObj];
        const removedItems = applyCollisions(Object.values(newObjArr), this.staticObjects, "default", 200 , 200);
        //var test = this.staticObjects.filter(staticObjects => !removedItems.includes(staticObjects));

        console.log(removedItems.length + " - " + this.staticObjects.length);



        this.staticObjects.push(new staticObject(r, itemx, itemy));

*/

      }
      


  }



  update() {
    // Berechne Vergangene Zeit
    const now = Date.now();
    const dt = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;


    // Jede Kugel updaten
    const bulletsToRemove = [];
    this.bullets.forEach(bullet => {
      if (bullet.update(dt)) {
        bulletsToRemove.push(bullet); // Zerstöre die Kugel
      }
    });
    this.bullets = this.bullets.filter(bullet => !bulletsToRemove.includes(bullet));

    // Update für jeden Spieler
    Object.keys(this.sockets).forEach(playerID => {
      const player = this.players[playerID];
      const newBullet = player.update(dt);
      if (newBullet) {
        //this.bullets.push(newBullet);

        //für Jede abgeschossene Kugel
        for (var j = 0; j < newBullet.length; j++){
          this.bullets.push(newBullet[j]); 
          //console.log(newBullet[j]);
        }

      }
    });

    // Kollisionen Abfragen Kugeln
    const removedBullets = applyCollisions(Object.values(this.players), this.bullets);
    removedBullets.forEach(b => {
      if (this.players[b.parentID]) {
        this.players[b.parentID].onDealtDamage(); //Score erhöhen
      }
    });
    this.bullets = this.bullets.filter(bullet => !removedBullets.includes(bullet));

    //Static Obj Kollisionen (Insel&Items)
    const removedItems = applyCollisions(Object.values(this.players), this.staticObjects, "item");
    this.staticObjects = this.staticObjects.filter(staticObjects => !removedItems.includes(staticObjects));



    // Checkt ob spieler gestorben sind
    Object.keys(this.sockets).forEach(playerID => {
      const socket = this.sockets[playerID];
      const player = this.players[playerID];
      if (player.hp <= 0) {
        socket.emit(Constants.MSG_TYPES.GAME_OVER);
        this.removePlayer(socket);
      }
    });

    // Sendet ein Game update jedem spieler
    if (this.shouldSendUpdate) {
      const leaderboard = this.getLeaderboard();
      Object.keys(this.sockets).forEach(playerID => {
        const socket = this.sockets[playerID];
        const player = this.players[playerID];
        socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(player, leaderboard));
      });
      this.shouldSendUpdate = false;
    } else {
      this.shouldSendUpdate = true;
    }
  }

  // Ranking der playerscores
  getLeaderboard() {
    return Object.values(this.players)
      .sort((p1, p2) => p2.score - p1.score)
      .slice(0, 5)
      .map(p => ({ username: p.username, score: Math.round(p.score) }));
  }

  createUpdate(player, leaderboard) {
    const nearbyPlayers = Object.values(this.players).filter(
      p => p !== player && p.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );
    const nearbyBullets = this.bullets.filter(
      b => b.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );

    const nearbyStaticObjects = this.staticObjects.filter(
      b => b.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );

    //Debug
    //console.log(nearbyBullets.map(b => b.serializeForUpdate()));
    //console.log(nearbyStaticObjects.map(b => b.serializeForUpdate()));

    return {
      t: Date.now(),
      me: player.serializeForUpdate(),
      others: nearbyPlayers.map(p => p.serializeForUpdate()),
      bullets: nearbyBullets.map(b => b.serializeForUpdate()),
      staticObjects: nearbyStaticObjects.map(b => b.serializeForUpdate()),
      leaderboard,
    };


    
  }
}

module.exports = Game;
