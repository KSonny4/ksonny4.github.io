//GAME CONSTANTS
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PADDLE_CANVAS_WIDTH = 125;
const PADDLE_CANVAS_HEIGHT = 20;
const BALL_RADIUS = 15;
const PADDLE_MOVE = 15;
const BRICK_CANVAS_WIDTH = 60;
const BRICK_CANVAS_HEIGHT = 15;
const BALL_SPEEDX = 7;
const BALL_SPEEDY = 7;

//Ovechkin constant correction of the wall image
const OK_WALL_IMG = 20;

//Ovechkin constant correction if the ball does not precisely hit the PADDLE in X axis
const OK_PADDLE_X = 20

//Ovechkin constant correction if the ball does not precisely hit the PADDLE Y axis
const OK_PADDLE_Y = 10;

const PADDLE_MID_RANGE = [PADDLE_CANVAS_WIDTH/3,2*(PADDLE_CANVAS_WIDTH/3)]

const CONTROLS = {
    32: 'space',
    37: 'left',
    39: 'right',  
};


// Brick class represents each brick in game
class Brick{
      constructor(x, y, color, points){
            this._x = x;
            this._y = y;
            this._points = points;
            this._color = color;
            this.active = true;
      }      
}

class Arkanoid {
      constructor(){
            this.score = 0;
            this.canvas = document.getElementById("canv");
            this.ctx = this.canvas.getContext("2d");
            //Initial PADDLE position
            this.PADDLEX = (CANVAS_WIDTH - PADDLE_CANVAS_WIDTH)/2;
            this.PADDLEY = CANVAS_HEIGHT - PADDLE_CANVAS_HEIGHT;
            //Initial ball position
            this.ballX = this.PADDLEX + PADDLE_CANVAS_WIDTH/2;
            this.ballY = this.PADDLEY - BALL_RADIUS;
            //Initial ballspeed
            this.ballSpeedX = BALL_SPEEDX;
            this.ballSpeedY = BALL_SPEEDY;            
            //Load Bricks, gotta change
            this.bricks = this.createBricks();
            this.started = false;
            this.loadScreen = true;
            this.finish = false;            

            this.gameCycle();

      }

      // Game loop
      gameCycle(){
            document.addEventListener("keydown", this.keyDownPressHandler.bind(this), false);
            document.addEventListener("keyup", this.keyUpPressHandler.bind(this), false);            

            setTimeout(this.reDraw, 1000/60);
            this.renderGameBoard();            

            if(this.bricks.length == 0){
                  this.finish = true;
                  this.renderFinishGame();
            }

            if(!this.finish) requestAnimationFrame(this.gameCycle.bind(this));
      }

      // Render content after finishing the game
      renderFinishGame(){
            if(this.score > localStorage.getItem("score")){
                  localStorage.setItem("score", this.score)
            }
            var s = document.getElementById("finScore");
            s.textContent = "Your score: " + this.score;

            document.getElementById("cv").style.display = "none";
            document.getElementById("gameover").style.display = "flex";

            document.getElementById("playagain").addEventListener("click", ()=>{
                  document.getElementById("cv").style.display = "flex";
                  document.getElementById("gameover").style.display = "none";
                  this.createBricks();
                  this.resetGame();
                  this.gameCycle();
            })
      }

      renderGameBoard(){

            var score = document.getElementById("score");
            score.textContent = "Your score: " + this.score;
            var hs = document.getElementById("hs");
            hs.textContent = "Highest score: " + localStorage.getItem("score");

            var background = new Image();
            background.src = "images/arcanoid_background.png";
            this.ctx.drawImage(background,0,0);            

            
            this.checkPADDLEMove();
            this.moveBall();
            this.PADDLEDetectWallcollision();
            this.ballWallCollision();
            this.ballBrickCollision();
            this.loadGame();

            
      }

      // Loads game content, bricks, PADDLE, ball
      loadGame(){
            //render bricks
            for(var i = 0; i < this.bricks.length; i++){
                  this.ctx.fillStyle = this.bricks[i]._color;
                  this.ctx.fillRect(this.bricks[i]._x, this.bricks[i]._y, BRICK_CANVAS_WIDTH, BRICK_CANVAS_HEIGHT);                  
                  this.ctx.shadowColor = 'grey';
                  this.ctx.shadowOffsetX = 1;
                  this.ctx.shadowOffsetY = 1;
                  //this.ctx.strokeRect(0, 0, this.bricks[i]._x, this.bricks[i]._y);

            }
            //render PADDLE
            this.ctx.fillStyle = "#948C9A";
            this.ctx.fillRect(this.PADDLEX, this.PADDLEY, PADDLE_CANVAS_WIDTH , PADDLE_CANVAS_HEIGHT);
            //render ball
            this.ctx.fillStyle = "#87CFE1";
            this.ctx.beginPath();
            this.ctx.arc(this.ballX, this.ballY, BALL_RADIUS, 0, Math.PI*2, true);
            this.ctx.fill();
      }


      // resets the game when player fails to hit the ball
      resetGame(){
            this.finish = false;
            this.started = false;
            this.PADDLEX = (CANVAS_WIDTH - PADDLE_CANVAS_WIDTH)/2;
            this.PADDLEY = CANVAS_HEIGHT - PADDLE_CANVAS_HEIGHT;
            this.ballX = this.PADDLEX + PADDLE_CANVAS_WIDTH/2;
            this.ballY = this.PADDLEY -  BALL_RADIUS;
            this.ballSpeedX = BALL_SPEEDX;
            this.ballSpeedY = BALL_SPEEDY;
            this.score = 0;
            this.bricks = this.createBricks();
      }

      // Creates bricks in double loop, saves to the array of Brick objects.
      createBricks(){
            var colors = ["#A49BA6", "#F70100", "#FFED2A", "#0771F9", "#FF09FC", "#00FF00"];
            var scores = [60, 50, 40, 30, 20, 10];
            var bricks = [] ;
            for(var j = 0; j < 6; j++){
                  for (var i= 0; i < 12; i++){
                        var b = new Brick(22+63*i, j*15 + 50, colors[j], scores[j]);                        
                        bricks.push(b);
                  }
            }
            
            return bricks;
      }

      // Moves ball across the board, based on variable started.
      moveBall(){
            //Move
            if(this.started){
                  this.ballX += this.ballSpeedX;
                  this.ballY -= this.ballSpeedY;                  
            }else {
                  this.ballX = this.PADDLEX + PADDLE_CANVAS_WIDTH/2;
            }
      }

      // moves PADDLE, depending on key pressed.
      checkPADDLEMove(){
            if(this.leftPress) this.PADDLEX -= PADDLE_MOVE;            
            if (this.rightPress) this.PADDLEX += PADDLE_MOVE;
      }
      //Handlers for detecting key press. It changes instance variable.
      keyDownPressHandler(e){
            var key = CONTROLS[e.keyCode];
            if(key == 'left') this.leftPress = true;            
            if(key == 'right') this.rightPress = true;
            if(key == 'space'){
                  if(this.loadScreen){
                        this.loadScreen = false;
                  } else {
                        this.started = true;
                  }
            }
      }

      keyUpPressHandler(e){
            var key = CONTROLS[e.keyCode];
            if(key == 'left') this.leftPress = false;            
            if(key == 'right') this.rightPress = false;            
      }

// ---------------------- COLLISIONS ------------------------
// ----------------------------------------------------------

      // Detects PADDLE-wall collison and stop PADDLE if it reaches wall
      PADDLEDetectWallcollision(){
            //PADDLE wall collision detection
            if(this.PADDLEX <= 0){
                  this.PADDLEX = 0;
            } else if (this.PADDLEX >= CANVAS_WIDTH - PADDLE_CANVAS_WIDTH){
                  this.PADDLEX = CANVAS_WIDTH - PADDLE_CANVAS_WIDTH;
            }
      }

      // returns true if ball is out of range of PADDLE
      ballOutOfRange(){
            return (this.ballX <= this.PADDLEX - OK_PADDLE_X || this.ballX >= this.PADDLEX + PADDLE_CANVAS_WIDTH + OK_PADDLE_X) ;
      }

      // Detects ball-wall collsion and changes ball direction on collision.
      ballWallCollision(){

            if(this.ballX <= BALL_RADIUS + OK_WALL_IMG || this.ballX >= CANVAS_WIDTH - BALL_RADIUS - OK_WALL_IMG){
                  this.ballSpeedX = this.ballSpeedX * (-1);
            }
            if(this.ballY <= BALL_RADIUS + OK_WALL_IMG){
                  this.ballSpeedY = this.ballSpeedY * (-1);
            }

            //PADDLECollision
            if(this.ballY + BALL_RADIUS/4 >= CANVAS_HEIGHT - PADDLE_CANVAS_HEIGHT - OK_PADDLE_Y  && !this.ballOutOfRange()){

                  if(this.ballX > this.PADDLEX + PADDLE_MID_RANGE[0] && this.ballX <= this.PADDLEX + PADDLE_MID_RANGE[1]){                        
                        this.ballSpeedX = Math.floor((Math.random() * 10) + 1); 
                  }
                  else{ 
                   this.ballSpeedX = this.ballSpeedX * (-1);                                                                                                                         
             }

             this.ballSpeedY = this.ballSpeedY * (-1);


       } else if (this.ballY >= CANVAS_HEIGHT - PADDLE_CANVAS_HEIGHT - OK_PADDLE_Y){

            if(this.score > localStorage.getItem("score")){
                  localStorage.setItem("score", this.score)
            }
            this.resetGame();
      }
}



      // returns true if ball is in range of brick.
      isInRangeofBrick(brick){
            return this.ballX -BALL_RADIUS + 2.5 <= brick._x + BRICK_CANVAS_WIDTH && this.ballX + BALL_RADIUS - 2.5 >= brick._x &&
            this.ballY - BALL_RADIUS + 2.5 <= brick._y + BRICK_CANVAS_HEIGHT && brick._y + BALL_RADIUS - 2.5  >= brick._y;
      }

      // detecs ball-brick collsion, changes ball direction on hit and deletes brick from bricks array.
      ballBrickCollision(){
            var brick;
            for(var i = 0; i < this.bricks.length; i++){
                  brick = this.bricks[i];
                  if(this.isInRangeofBrick(brick)){
                        this.score += brick._points;                                                
                        brick.active = false;
                        this.bricks = this.bricks.filter( x=> {
                              return x.active == true;
                        })
                        this.ballSpeedY = this.ballSpeedY * (-1);
                        new Audio("./sound/hit.mp3").play();
                  }
            }
      }
      
}

new Arkanoid();
