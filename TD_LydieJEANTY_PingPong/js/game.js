var game = {
  groundWidth : 900,
  groundHeight : 600,
  groundColor: "#000000",
  netWidth : 6,
  netColor: "#FFFFFF",

  scorePosPlayer1 : 400,
  scorePosPlayer2 : 465,
 
  groundLayer : null,  
  scoreLayer : null,
  playersBallLayer : null,

  wallSound : new Audio("./sound/wall.ogg"),
  playerSound : new Audio("./sound/player.ogg"),
  goalSound : new Audio("./sound/goal.mp3"),

  divGame : null,

  gameOn : false,
  startGameButton : null,
  endScore : 8 ,

  ball : {
    width : 15,
    height : 15,
    color : "#81b214",
    
    posX : 200,
    posY : 200,
    directionX : 1,
    directionY : 1,
    speed : 6,
    inGame : false,

    bounce : function(soundToPlay) {
      if ( this.posX+(this.height/2) > game.groundWidth || this.posX-(this.height/2) < 0 ) {
        this.directionX = -this.directionX;
        soundToPlay.play();
      }
      if ( this.posY+(this.height/2) > game.groundHeight || this.posY+(this.height/2) < 0  ) {
        this.directionY = -this.directionY;
        soundToPlay.play();
      }    
    },

    move : function() {
      if ( this.inGame ) {
        this.posX += this.directionX * this.speed;
        this.posY += this.directionY * this.speed;
      }
    },

    collide : function(anotherItem) {
      if ( !( this.posX >= anotherItem.posX + anotherItem.width || this.posX <= anotherItem.posX - this.width
      || this.posY >= anotherItem.posY + anotherItem.height || this.posY <= anotherItem.posY - this.height ) ) {
        // Collision
        return true;
      } 
      return false;
    },
    
    lost : function(player) {
      var returnValue = false;
      if ( player.originalPosition == "left" && (this.posX) <= 8 ) {
        returnValue = true;
      } else if ( player.originalPosition == "right" && (this.posX+this.height) >= game.groundWidth ) {
        returnValue = true;
      }
      return returnValue;
    },

    speedUp: function() {
      this.speed = this.speed + .1;
    }
  },

  playerOne : {
    width : 10,
    height : 100,
    color : "#FFFFFF",
    posX : 30,
    posY : 200,
    goUp : false,
    goDown : false,
    originalPosition : "left",
    score : 0,
    ai : false
  },
     
  playerTwo : {
    width : 10,
    height : 100,
    color : "#FFFFFF",
    posX : 860,
    posY : 200,
    goUp : false,
    goDown : false,
    originalPosition : "right",
    score : 0,
    ai : true
  },

  init : function() {
    this.divGame = document.getElementById("game");
   
    this.groundLayer= game.display.createLayer("terrain", this.groundWidth, this.groundHeight, this.divGame, 0, "#000000", 10, 50); 
    game.display.drawRectangleInLayer(this.groundLayer, this.netWidth, this.groundHeight, this.netColor, this.groundWidth/2 - this.netWidth/2, 0);
    
    this.scoreLayer = game.display.createLayer("score", this.groundWidth, this.groundHeight, this.divGame, 1, undefined, 10, 50);
     
    this.playersBallLayer = game.display.createLayer("joueursetballe", this.groundWidth, this.groundHeight, this.divGame, 2, undefined, 10, 50);  
    //game.display.drawTextInLayer(this.playersBallLayer, "", "10px Arial", "#FF0000", 100, 100);
     
    this.displayScore(0,0);
    this.displayBall(200,200);
    this.displayPlayers();

    this.startGameButton = document.getElementById("startGame");
    this.initStartGameButton();
    
    this.initKeyboard(game.control.onKeyDown, game.control.onKeyUp);
    this.initMouse(game.control.onMouseMove);

    game.ai.setPlayerAndBall(this.playerTwo, this.ball);
    game.speedUpBall();
    
  },

  displayScore : function(scorePlayer1, scorePlayer2) {
    game.display.drawTextInLayer(this.scoreLayer, scorePlayer1, "60px Arial", "#FFFFFF", this.scorePosPlayer1, 55);
    game.display.drawTextInLayer(this.scoreLayer, scorePlayer2, "60px Arial", "#FFFFFF", this.scorePosPlayer2, 55);
  },

  displayBall : function() {
    game.display.drawRectangleInLayer(this.playersBallLayer, this.ball.width, this.ball.height, this.ball.color, this.ball.posX, this.ball.posY);
  } ,

  displayPlayers : function() {
    game.display.drawRectangleInLayer(this.playersBallLayer, this.playerOne.width, this.playerOne.height, this.playerOne.color, this.playerOne.posX, this.playerOne.posY);
    game.display.drawRectangleInLayer(this.playersBallLayer, this.playerTwo.width, this.playerTwo.height, this.playerTwo.color, this.playerTwo.posX, this.playerTwo.posY);
  },

  moveBall : function() { 
    this.ball.move();
    this.ball.bounce(this.wallSound);
    this.displayBall();
  },

  clearLayer : function(targetLayer) {
    targetLayer.clear();
  },

  initKeyboard : function(onKeyDownFunction, onKeyUpFunction) {
    window.onkeydown = onKeyDownFunction;
    window.onkeyup = onKeyUpFunction;
  },

  endGame : function() {
    if(this.playerOne.score == 8){
      return true ;
    }
    if(this.playerTwo.score == 8){
      return true ;
    }
    return false;
  },

  movePlayers : function() {
    if ( game.control.controlSystem == "KEYBOARD" ) {
      // keyboard control
      if ( game.playerOne.goUp && (game.playerOne.posY) > 0) {
        game.playerOne.posY-=5;
      } else if ( game.playerOne.goDown && ((game.playerOne.posY+(game.playerOne.height)+5)< this.groundHeight)) {
        game.playerOne.posY+=5;
      }
    }/* else if ( game.control.controlSystem == "MOUSE" ) {
      // mouse control
      if (game.playerOne.goUp && game.playerOne.posY > game.control.mousePointer)
        game.playerOne.posY-=5;
      else if ((game.playerOne.goDown && game.playerOne.posY < game.control.mousePointer) && ((game.playerOne.posY+(game.playerOne.height/2)+5)< this.groundHeight))  
        game.playerOne.posY+=5;
    }*/
  },

  initMouse : function(onMouseMoveFunction) {
    window.onmousemove = onMouseMoveFunction;
  },

  collideBallWithPlayersAndAction : function() { 
    if ( this.ball.collide(game.playerOne) ) {
      this.changeBallPath(game.playerOne, game.ball);
      this.playerSound.play();
    }
    if ( this.ball.collide(game.playerTwo) ) {
      this.changeBallPath(game.playerTwo, game.ball);
      this.playerSound.play();
    }
  }, 

  lostBall : function() {
    if ( this.ball.lost(this.playerOne) ) {
      this.playerTwo.score++;
      this.goalSound.play();

        this.ball.inGame = false;
     
        if ( this.playerOne.ai ) { 
          setTimeout(game.ai.startBall(), 3000);
        }

    } else if ( this.ball.lost(this.playerTwo) ) {
      this.playerOne.score++;
      this.goalSound.play();

        this.ball.inGame = false;
 
        if ( this.playerTwo.ai ) { 
          setTimeout(game.ai.startBall(), 3000);
        }

    }
   
    this.scoreLayer.clear();
    this.displayScore(this.playerOne.score, this.playerTwo.score);
  },

  initStartGameButton : function() {
    this.startGameButton.onclick = game.control.onStartGameClickButton;
  },

  reinitGame : function() {
    this.ball.inGame = false;
    this.ball.speed = 4;
    this.playerOne.score = 0;
    this.playerTwo.score = 0;
    this.scoreLayer.clear();
    this.displayScore(this.playerOne.score, this.playerTwo.score);
  },

  ballOnPlayer : function(player, ball) {
    var returnValue = "CENTER";
    var playerPositions = player.height/5;
    if ( ball.posY > player.posY && ball.posY < player.posY + playerPositions ) {
      returnValue = "TOP";
    } else if ( ball.posY >= player.posY + playerPositions && ball.posY < player.posY + playerPositions*2 ) {
      returnValue = "MIDDLETOP";
    } else if ( ball.posY >= player.posY + playerPositions*2 && ball.posY < player.posY + 
      player.height - playerPositions ) {
      returnValue = "MIDDLEBOTTOM";
    } else if ( ball.posY >= player.posY + player.height - playerPositions && ball.posY < player.posY + 
      player.height ) {
      returnValue = "BOTTOM";
    }
    return returnValue;
  },

  changeBallPath : function(player, ball) {
    if ( player.originalPosition == "left" ) {
      switch( game.ballOnPlayer(player, ball) ) {
        case "TOP":
          ball.directionX = 1;
          ball.directionY = -3;
          break;
        case "MIDDLETOP":
          ball.directionX = 1;
          ball.directionY = -1;
          break;
        case "CENTER":
          ball.directionX = 2;
          ball.directionY = 0;
          break;
        case "MIDDLEBOTTOM":
          ball.directionX = 1;
          ball.directionY = 1;
          break;
        case "BOTTOM":
          ball.directionX = 1;
          ball.directionY = 3;
          break;
      }
  } else {
      switch( game.ballOnPlayer(player, ball) ) {
        case "TOP":
          ball.directionX = -1;
          ball.directionY = -3;
          break;
        case "MIDDLETOP":
          ball.directionX = -1;
          ball.directionY = -1;
          break;
        case "CENTER":
          ball.directionX = -2;
          ball.directionY = 0;
          break;
        case "MIDDLEBOTTOM":
          ball.directionX = -1;
          ball.directionY = 1;
          break;
        case "BOTTOM":
          ball.directionX = -1;
          ball.directionY = 3;
          break;
      }
    }
  },

  speedUpBall: function() { 
    setInterval(function() {
    game.ball.speedUp();
  }, 5000);
  },


  
};