module.exports = Object.freeze({

  ISLAND_SIZE: 160, // Größe einer Insel
  ITEM_SIZE: 20, //Item Größe

  MAX_ISLANDS: 10, //Maximal gespawnte Inseln
  MAX_ITEMS: 20, //Maximale Anzahl an items

  REPAIR_BOOST: 70, // Reparier Item lebenspunkte

  PLAYER_SPEED: 60, 
  PLAYER_MAX_HP: 100,
  PLAYER_RADIUS: 80,
  PLAYER_FIRE_COOLDOWN: 1.25, // Bullet Schieß cooldown


  BULLET_RADIUS: 3, // 3
  BULLET_SPEED: 200, // 700
  BULLET_DAMAGE: 10, // 10

  SCORE_BULLET_HIT: 20, // 20
  SCORE_PER_SECOND: 1, // 1

  MAP_SIZE: 3000, // Spiel größe
  MSG_TYPES: {
    GAME_OVER: 'dead',
    JOIN_GAME: 'join_game',
    GAME_UPDATE: 'update',
    INPUT: 'input',
  },
});
