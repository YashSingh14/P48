var PLAY = 1;
var END = 0;
var gameState = PLAY;

var mario, mario_running, mario_collided;
var ground, invisibleGround, groundImage;
var pipesGroup, pipe;

var score=0;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  mario_running =   loadAnimation("Mario1.png","Mario2.png","Mario3.png","Mario4.png","Mario5.png","Mario6.png","Mario7.png","Mario8.png");
  mario_collided = loadAnimation("Mario1.png");
  bg1 = loadImage("bg.jpg")
  groundImage = loadImage("Mario_platform.png");
  pipe = loadImage("pipe1.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(600, 200);
  
  mario = createSprite(50,180,20,50);
  
  mario.addAnimation("running", mario_running);
  mario.addAnimation("collided",mario_collided);
  mario.scale = 0.8;
  
  ground = createSprite(200,210,600,20);
  ground.addImage("ground",groundImage);
  ground.x = 350;
  ground.velocityX = -(6 + 3*score/100);

  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);

  
  gameOver.scale = 0.7;
  restart.scale = 0.7;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,185,400,10);
  invisibleGround.visible = false;


  pipesGroup = new Group();
  
  score = 0;
}

function draw() {
  background(bg1);
  fill("red")
  text("Score: "+ score, 500,50);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -10
  
    if(keyDown("space") && mario.y >= 158) {
      mario.velocityY = -10;
    }
  
    mario.velocityY = mario.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    mario.collide(invisibleGround);

    spawnPipes();

    if(pipesGroup.isTouching(mario)){
      gameState = END;
  
  }  
}

else if (gameState === END) {
  gameOver.visible = true;
  restart.visible = true;

  ground.velocityX = 0;
  pipesGroup.setVelocityXEach(0);
  mario.velocityY = 0;
  mario.changeAnimation("collided",mario_collided)

  if(mousePressedOver(restart)) {
    reset();
  }
}
  drawSprites();
}

function spawnPipes() {

  if (frameCount % 60 === 0) {
    var pipe10 = createSprite(Math.round(random(700, 1200)),165,10,10);
    pipe10.addImage(pipe);
    pipe10.scale = 0.1;
    pipe10.velocityX = -9;

    pipe10.lifetime = 1500;
    
    pipe10.depth = bg1.depth
    pipe10.depth = bg1.depth + 1;
    pipe10.setCollider("rectangle", 0, 0, 40, 60)
    pipesGroup.add(pipe10);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  pipesGroup.destroyEach();
  
  mario.changeAnimation("running",mario_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}