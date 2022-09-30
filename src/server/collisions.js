const Constants = require('../shared/constants');

// Array welche 
function applyCollisions(players, object, trigger="bullet",radius1 = Constants.PLAYER_RADIUS,radius2 = Constants.BULLET_RADIUS) {
  const removedobject = []; // Gibt die Objekte zurück die nach der Kollision zerstört wurden
  for (let i = 0; i < object.length; i++) {
    // Sucht spieler der nicht der eigentümer ist
    for (let j = 0; j < players.length; j++) {
      const bullet = object[i];
      const player = players[j];
      if (bullet.parentID !== player.id && player.distanceTo(bullet) <= radius1 + radius2) {
  
        if(trigger == "bullet"){
          removedobject.push(bullet);
          player.takeBulletDamage();
        }else if(trigger == "item"){
          if(bullet.itemClass == 1){
            player.takeDamage(1);
            //console.log(bullet.itemClass);
          }else if(bullet.itemClass == 2){
            removedobject.push(bullet);
            player.takeRepairBoost();
            player.takeCoins(10); // Score um 10 erhöhen
          }else if(bullet.itemClass == 3){
            removedobject.push(bullet);
            player.takeCoins(200); // Score um 200 Erhöhen
          }else if(bullet.itemClass == 4){
            removedobject.push(bullet);
            player.takeShootBoost(20); //20 Sekunden Schneller schießen
          }
        }else{
          removedobject.push(bullet); // Für default abfrage für z.b. item platz finden
        }

        
        break; // Doppeltes zählen verhindern
      }
    }
  }
  return removedobject;
}

module.exports = applyCollisions;
