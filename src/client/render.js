
import { debounce } from 'throttle-debounce';
import { getAsset } from './assets';
import { getCurrentState } from './state';

const Constants = require('../shared/constants');

const { PLAYER_RADIUS, PLAYER_MAX_HP, BULLET_RADIUS, MAP_SIZE ,ISLAND_SIZE, ITEM_SIZE} = Constants;


const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');
setCanvasDimensions();

function setCanvasDimensions() {
  // mobile
  const scaleRatio = Math.max(1, 800 / window.innerWidth);
  canvas.width = scaleRatio * window.innerWidth;
  canvas.height = scaleRatio * window.innerHeight;
}

window.addEventListener('resize', debounce(40, setCanvasDimensions));

let animationFrameRequestId;

function render() {
  const { me, others, bullets , staticObjects} = getCurrentState();
  if (me) {
    // zeichne background
    renderBackground(me.x, me.y);

    // zeichne Border
    context.strokeStyle = 'yellow';
    context.lineWidth = 10;
    context.strokeRect(canvas.width / 2 - me.x, canvas.height / 2 - me.y, MAP_SIZE, MAP_SIZE);

    // zeichne all bullets
    bullets.forEach(renderBullet.bind(null, me));


    //Static Objekte
    staticObjects.forEach(renderStaticItem.bind(null, me));
    // gib alle player aus
    renderPlayer(me, me);
    others.forEach(renderPlayer.bind(null, me));
  }

  // Wiederhole rendering im nächsten frame
  animationFrameRequestId = requestAnimationFrame(render);
}

function renderBackground(x, y) {
  const backgroundX = MAP_SIZE / 2 - x + canvas.width / 2;
  const backgroundY = MAP_SIZE / 2 - y + canvas.height / 2;
  const backgroundGradient = context.createRadialGradient(
    backgroundX,
    backgroundY,
    MAP_SIZE / 10,
    backgroundX,
    backgroundY,
    MAP_SIZE / 2,
  );
  backgroundGradient.addColorStop(0, 'DeepSkyBlue');
  backgroundGradient.addColorStop(1, 'blue');
  context.fillStyle = backgroundGradient;


  var background = new Image();
  //background.src = "http://i.epvpimg.com/szvjdab.jpg";
  context.fillRect(0, 0, canvas.width, canvas.height);


  //context.drawImage(background,backgroundX,backgroundY);

  //context.fillRect(0, 0, canvas.width, canvas.height);
}

// rendering von schiff zu den Koordinaten


function renderPlayer(me, player) {
  const { x, y, direction, boatlvl } = player;
  const canvasX = canvas.width / 2 + x - me.x;
  const canvasY = canvas.height / 2 + y - me.y;

  // zeichne schiff
  context.save();
  context.translate(canvasX, canvasY);
  context.rotate(direction);
  const teiler = 6;
  /*
  context.drawImage(
    getAsset('pirateship.png'),
    -PLAYER_RADIUS / teiler,
    -PLAYER_RADIUS * 2.32 / teiler,
    PLAYER_RADIUS * 2 / teiler,
    PLAYER_RADIUS * 2 * 2.32 / teiler,
  );
*/

  if(boatlvl == 0){
    context.drawImage(
      getAsset('pirateship.png'),
      -PLAYER_RADIUS / 2.32 ,
      -PLAYER_RADIUS ,
      PLAYER_RADIUS * 2 / 2.32,
      PLAYER_RADIUS * 2 ,
    );
  }else if(boatlvl == 1){
    //console.log(boatlvl);
    context.drawImage(
      getAsset('lvl2.png'),
      -PLAYER_RADIUS / 2.32 ,
      -PLAYER_RADIUS ,
      PLAYER_RADIUS * 2 / 2.32,
      PLAYER_RADIUS * 2 ,
    );
  }else if(boatlvl == 2){
    //console.log(boatlvl);
    context.drawImage(
      getAsset('pirateship.png'),
      -PLAYER_RADIUS / 2.32 ,
      -PLAYER_RADIUS ,
      PLAYER_RADIUS * 2 / 2.32,
      PLAYER_RADIUS * 2 ,
    );
  }else if(boatlvl == 3){
    //console.log(boatlvl);
    context.drawImage(
      getAsset('pirateship.png'),
      -PLAYER_RADIUS / 2.32 ,
      -PLAYER_RADIUS ,
      PLAYER_RADIUS * 2 / 2.32,
      PLAYER_RADIUS * 2 ,
    );
  }


  context.restore();

  // zeichne health bar
  context.fillStyle = 'white';
  context.fillRect(
    canvasX - PLAYER_RADIUS,
    canvasY + PLAYER_RADIUS + 8,
    PLAYER_RADIUS * 2,
    2,
  );
  context.fillStyle = 'red';
  context.fillRect(
    canvasX - PLAYER_RADIUS + PLAYER_RADIUS * 2 * player.hp / PLAYER_MAX_HP,
    canvasY + PLAYER_RADIUS + 8,
    PLAYER_RADIUS * 2 * (1 - player.hp / PLAYER_MAX_HP),
    2,
  );
}

function renderBullet(me, bullet) {
  const { x, y } = bullet;
  context.drawImage(
    getAsset('bullet.svg'),
    canvas.width / 2 + x - me.x - BULLET_RADIUS,
    canvas.height / 2 + y - me.y - BULLET_RADIUS,
    BULLET_RADIUS * 2,
    BULLET_RADIUS * 2,
  );
}

function renderStaticItem(me, staticItem) {
  const { x, y ,itemClass} = staticItem;

  if(itemClass == 1){
    context.drawImage(
      getAsset('DefaultInsel.png'),
      canvas.width / 2 + x - me.x - ISLAND_SIZE,
      canvas.height / 2 + y - me.y - ISLAND_SIZE,
      ISLAND_SIZE * 2,
      ISLAND_SIZE * 2,
    );


  }else if(itemClass == 2){
    context.drawImage(
      getAsset('repair.png'),
      canvas.width / 2 + x - me.x - ITEM_SIZE,
      canvas.height / 2 + y - me.y - ITEM_SIZE,
      ITEM_SIZE * 2,
      ITEM_SIZE * 2,
    );
  }else if(itemClass == 3){
    context.drawImage(
      getAsset('schatz.png'),
      canvas.width / 2 + x - me.x - ITEM_SIZE,
      canvas.height / 2 + y - me.y - ITEM_SIZE,
      ITEM_SIZE * 2,
      ITEM_SIZE * 2,
    );
  }else if(itemClass == 4){
    context.drawImage(
      getAsset('boost.png'),
      canvas.width / 2 + x - me.x - ITEM_SIZE,
      canvas.height / 2 + y - me.y - ITEM_SIZE,
      ITEM_SIZE * 2,
      ITEM_SIZE * 2,
    );
  }
}

function renderMainMenu() {
  const t = Date.now() / 7500;
  const x = MAP_SIZE / 2 + 800 * Math.cos(t);
  const y = MAP_SIZE / 2 + 800 * Math.sin(t);
  renderBackground(x, y);

  // wiederhole render funktion im nächsten farme
  animationFrameRequestId = requestAnimationFrame(renderMainMenu);
}

animationFrameRequestId = requestAnimationFrame(renderMainMenu);

// ersetze main screen rendering mit ingame rendering
export function startRendering() {
  cancelAnimationFrame(animationFrameRequestId);
  animationFrameRequestId = requestAnimationFrame(render);
}

// ersetze ingame rendering mit main screen rendering
export function stopRendering() {
  cancelAnimationFrame(animationFrameRequestId);
  animationFrameRequestId = requestAnimationFrame(renderMainMenu);
}
