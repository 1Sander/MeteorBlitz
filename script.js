var canvas = document.getElementById('canvas').getContext("2d");
canvas.imageSmoothingEnabled = false;

document.addEventListener("click", function(e){
  if (currentScene.click){
    currentScene.click();
  }

});

document.addEventListener("mousemove", function(e){
  if (currentScene.moveShip){
    currentScene.moveShip(e);
  }
});

var laser = new Audio("assets/sounds/laser.wav");
var explosion = new Audio("assets/sounds/explosion.wav")


var currentScene = {};
function changeScene(scene){
  currentScene = scene;
}

var pts = 0;

var groupShoot = [];
var shoots = {
  draw(){
    groupShoot.forEach((shoot) => {
    shoot.draw();
    });

  },
  update(){
    groupShoot.forEach((shoot) => {
    shoot.move();

      if (shoot.y <= -100) {
        groupShoot.splice(shoot[0], 1);
      }

    });
  },

};

var groupMeteors = [];
var meteors = {
  time: 0,
  spawnMeteors(){
    this.time += 1;

    size = Math.random() * (80 - 50) + 50;
    posx = Math.random() * (450 - 10) + 10;

    if (this.time >= 60){
      this.time = 0;
      groupMeteors.push(new Meteors(posx,-100,size,size, "assets/meteoro.png"));
    }
  },

  destroyMeteors(){
     groupShoot.forEach((shoot) => {
       groupMeteors.forEach((meteors) => {
         if (shoot.collide(meteors)) {
           groupShoot.splice(groupShoot.indexOf(shoot), 1);
           groupMeteors.splice(groupMeteors.indexOf(meteors), 1);
           pts += 1;
           explosion.play();
         }
       });

     });

   },

  draw(){
    groupMeteors.forEach((m) => {
      m.draw();
    });
  },
  update(){
    this.spawnMeteors();
    this.destroyMeteors();
     groupMeteors.forEach((m) => {
       m.move();
       if (m.y > 900) {
         groupMeteors.splice(groupMeteors.indexOf(m), 1);
         changeScene(gameover);
       }
     });
   },
 }

var infinityBg = {
  bg : new Obj(0,0,500,900,"assets/fundo.png"),
  bg2 : new Obj(0,-900,500,900,"assets/fundo.png"),

  draw(){
    this.bg.draw();
    this.bg2.draw();
  },

  moveBg(){

    this.bg.y += 1;
    this.bg2.y += 1;

    if (this.bg.y >= 900) {
      this.bg.y = 0;
    }
    if (this.bg2.y >= 0) {
      this.bg2.y = -900;
    }
  },
};

var menu = {

  title: new Text("MeteorBlitz"),
  label: new Text("Click to Play"),
  ship : new Obj(220, 800, 60, 50,"assets/nave.png"),

      click(){
        changeScene(game);
      },

  draw(){
    infinityBg.draw();
    this.title.draw_text(60, "Arial", 100, 300, "white");
    this.label.draw_text(20, "Arial", 200, 400, "white");
    this.ship.draw();
  },
  update(){
    infinityBg.moveBg();
  },
};

var game = {

  score : new Text("0"),
  ship : new Obj(220, 800, 60, 50,"assets/nave.png"),

  click(){
        groupShoot.push(new Shoot(this.ship.x + this.ship.width / 2,this.ship.y,10,10,"assets/tiro.png"));
        laser.play();
    },

  moveShip(event){
    this.ship.x = event.offsetX + this.ship.width /2 -65;
    this.ship.y = event.offsetY - 30;
  },

  draw(){
    infinityBg.draw();
    this.score.draw_text(30,"arial", 40, 40, "white");
    this.ship.draw();
    shoots.draw();
    meteors.draw();

  },
  update(){
    infinityBg.moveBg();
    shoots.update();
    meteors.update();
    this.score.update_text(pts);
  },
};

var gameover = {

  score : new Text("0"),
  label_gameover : new Text("GameOver"),

  draw(){
    infinityBg.draw();
      this.score.draw_text(30,"arial", 40, 40, "white");
      this.label_gameover.draw_text(60,"arial", 100, 450, "white");
      },
  update(){
    infinityBg.moveBg();
    this.score.update_text(pts);
  },

  cleanScene(){
  //  pts = 0;
    groupMeteors = [];
    groupShoot = [];
  },

  click(){
    this.cleanScene();
    changeScene(gameover);
  },
};

function main(){
  canvas.clearRect(0,0,500,900);
  currentScene.draw();
  currentScene.update();
  requestAnimationFrame(1000);
}

changeScene(menu);

setInterval(main, 6);
