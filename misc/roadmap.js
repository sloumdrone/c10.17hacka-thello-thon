$(document).ready(function(){
      // $('span').click(function() {
      //   $('.modal').css('display', 'none');
      // });

    game = new Game();

    updateDisplay();


    game = new Game();
    $('.hamburger').on('click',hamburgerMenu);
    $('.reset-game').on('click',resetGame);
    $('.container').on('click','div.square', handleBoardClick);
    $('.turn#firstPlayer').toggleClass('thingy');
    $('#secondPlayerPassDiv').toggleClass('passBtnClass');
    $('.passBtn1').click(checkSameRound);
    $('.passBtn2').click(checkSameRound);
    $('.modal-content').on('click',closeModalAndReset);
    $('.toggle-slider-body').click(function(){
      if (game.mode === 'ai'){
        $('.toggle-slider-disc').css('float','left');
        game.mode = 'human';
        game.clickable = true;
      } else {
        $('.toggle-slider-disc').css('float','right');
        game.mode = 'ai';
      }
    });
    buildBoard();
});

var game;
function Game(){
  //this creates an object that serves as the model for the Game
  //it will hold all position and statistical information
  //it will also have methods to update that information
  this.playing = true;
  this.currentPlayer = 'b';
  this.turn = 1;
  this.winner = null;
  this.menuOut = false;
  this.legalMoves = [];
  this.playerOneScore= null;
  this.newPlayerOneScore= null;
  this.playerTwoScore= null;
  this.newPlayerTwoScore= null;
  this.passButtClick = 0;
  this.mode = 'ai';
  this.clickable = true;

  //'e'=empty, 'w'=white, 'b'=black, 'l'=legal
  this.gameboard = [
    ['e','e','e','e','e','e','e','e'],
    ['e','e','e','e','e','e','e','e'],
    ['e','e','e','e','e','e','e','e'],
    ['e','e','e','b','w','e','e','e'],
    ['e','e','e','w','b','e','e','e'],
    ['e','e','e','e','e','e','e','e'],
    ['e','e','e','e','e','e','e','e'],
    ['e','e','e','e','e','e','e','e']
  ];

  this.directions = {//col then row
      'w' : [ 0, -1],
      'nw': [-1, -1],
      'n' : [-1,  0],
      'ne': [-1,  1],
      'e' : [ 0,  1],
      'se': [ 1,  1],
      's' : [ 1,  0],
      'sw': [ 1, -1]
  };

  this.score = {
    'b': 2,
    'w': 2
  };

  this.updateScore = function(amount){
    this.score[this.currentPlayer] += amount + 1;
    this.score[this.getOpponentName()] -= amount;
    this.turn++;
    console.log(this.turn);

  },

  this.checkForGameOver = function(){
      var cellCounter=0;
      for(var i=0; i<8; i++){
          for (var j=0; j<8; j++){
              if(this.gameboard[i][j]==="w"|| this.gameboard[i][j]==="b"){
                  cellCounter++;
              }
          }
      }
      console.log("THis is cell counter"+ cellCounter);
      if(cellCounter===63){
          checkWinState();
      }
  },

  this.getOpponentName = function(){
    return game.currentPlayer === 'b' ? 'w' : 'b';
  }
}

function resetGame(){
  //this will reset the game board
  $('.hamburger').css({'transform':'rotateZ(0deg)','right':'2vw'});
  $('.slider-menu').css({'right':'-20vw'});
  if (game.currentPlayer === 'b'){
    $('.turn#firstPlayer').toggleClass('thingy');
    $('.turn#secondPlayer').toggleClass('thingy2');
    $('#firstPlayerPassDiv').toggleClass('passBtnClass');
    $('#secondPlayerPassDiv').toggleClass('passBtnClass');
  }
  game.menuOut = false;
  game = new Game();
  buildBoard();
}


function buildBoard(){
    $('.turn#topFirstPlayer').text(game.score.w + ' pts.');
    $('.turn#topSecondPlayer').text(game.score.b + ' pts.');
    $('.turn#firstPlayer').toggleClass('thingy');
    $('.turn#secondPlayer').toggleClass('thingy2');
    $('#firstPlayerPassDiv').toggleClass('passBtnClass');
    $('#secondPlayerPassDiv').toggleClass('passBtnClass');




    // if(game.currentPlayer === 'b') {
    //     $('#firstPlayer').text('Your Turn');
    // }else if(game.currentPlayer === 'w'){
    //     $('#secondPlayer').text('Your Turn');
    //
    // }
  // $('.whitescore').text(game.score.w);
  // $('.blackscore').text(game.score.b);

  $('.container').empty();
  // var createRow= $('<div>').addClass('row');
  for(var i=0; i<8;i++) {
      $('<div>').addClass('row').appendTo('.container');
      for (var j = 0; j < 8; j++) {
          var blackPiece = $('<div>').addClass('black');
          var whitePiece = $('<div>').addClass('white');
          var legalMove = $('<div>').addClass('legalMove');
          var createColumn = $('<div>', {
              class: 'square',
              attr: {
                  row: i,
                  col: j
              }
          });
          $('.row:last-child').append(createColumn);
          if (game.gameboard[i][j] === 'b') {
              $('.row:last-child .square:last-child').append(blackPiece);
          } else if (game.gameboard[i][j] === 'w') {
              $('.row:last-child .square:last-child').append(whitePiece);
          } else if (game.gameboard[i][j] === 'l') {
              $('.row:last-child .square:last-child').append(legalMove);
          }
      }


      //this is the dom creation of the board, maybe make part of Game object
  }
}

function hamburgerMenu(){
  if (!game.menuOut){
    $(this).css({'transform':'rotateZ(90deg)','right':'22vw'});
    $('.slider-menu').css({'right':'0'});
    game.menuOut = true;
  } else {
    $(this).css({'transform':'rotateZ(0deg)','right':'2vw'});
    $('.slider-menu').css({'right':'-20vw'});
    game.menuOut = false;
  }

}


function updateDisplay() {
        //Update the board position and points in the display
        checkForLegalMoves();
        buildBoard();
}

function checkWinState(){
  //determine if a win state has been reached
  //this can maybe be accomplished purely based on turn number
  var green = game.score.w;
  var pink = game.score.b;

  if (pink > green) {
    $('.modal-content').css({'background-image':"url('./resources/images/pink-win.jpg')",'background-size':'cover'});
    $('.modal').css({
        'display': 'block',
        'background-color': 'rgba(163, 15, 126, 0.66)'
    });
    // var restartButton = $('<button>').text('Play again?').click(resetGame);
    // $('.modal-content').append(restartButton);

  } else if (green > pink) {
    $('.modal-content').css({'background-image':"url('./resources/images/green-win.jpg')",'background-size':'cover'});
    $('.modal').css({
        'display': 'block',
        'background-color': 'rgba(23, 163, 15, 0.66)'
    });
    // var restartButton = $('<button>').text('Play again?').click(resetGame);
    // $('.modal-content').append(restartButton);
  } else {
    $('.modal-content').css({'background-image':"url('./resources/images/tie-game.jpg')",'background-size':'cover'});
    $('.modal').css({
        'display': 'block',
        'background-color': 'rgba(197, 37,37, 0.75)'
    });
  }
}



function checkForLegalMoves(){
  game.legalMoves = [];
  for(var i=0; i<8;i++) {
    for (var j = 0; j < 8; j++) {
      var validDirections = [];
      var moveCount = 0;
      var startingPos = [i,j];

      if (game.gameboard[startingPos[0]][startingPos[1]] === 'e' || game.gameboard[startingPos[0]][startingPos[1]] === 'l') {
        for (item in game.directions) {
          checkDirection(item, startingPos);
          moveCount = 0;
        }
        if (validDirections.length > 0){
          game.legalMoves.push(startingPos);
          game.gameboard[i][j] = 'l'
        } else {
          game.gameboard[i][j] = 'e'
        }
      }

    }
  }


  function checkDirection(direction, startPoint) {//direction is a string (a valid key the obj)
      var currentPos = startPoint.slice();
      var newPos = [currentPos[0] + game.directions[direction][0], currentPos[1] + game.directions[direction][1]];
      if (newPos[0] < 8 && newPos[1] < 8 && newPos[0] >= 0 && newPos[1] >= 0){
        if (game.gameboard[newPos[0]][newPos[1]] === game.getOpponentName()) {
            moveCount++;
            checkDirection(direction, newPos);
        } else if (game.gameboard[newPos[0]][newPos[1]] === game.currentPlayer && moveCount > 0) {
            validDirections.push(direction);
            return true;
        } else {
            return false;

        }
      }

  }
}

function getOpponentName(){
  return game.currentPlayer === 'b' ? 'w' : 'b';
}

function handleBoardClick(){
  var rowAttr = $(this).attr('row');
  var colAttr = $(this).attr('col');
  var clickedPos = [Number(rowAttr), Number(colAttr)];
  game.checkForGameOver();
  if (game.clickable && game.playing){
      handleMove(clickedPos);
  }
}


function aiMove(){
  if (game.legalMoves.length > 0){
    game.passButtClick = 0;
    var randomMove = Math.floor(Math.random() * game.legalMoves.length);
    handleMove(game.legalMoves[randomMove]);
  } else {
    $('.passBtn2').click();
  }
}

function handleMove(startingPosArr) {
    var piecesFlipped = null;
    var validDirections = [];
    var moveCount = 0;
    game.passButtClick=0;


    if (game.gameboard[startingPosArr[0]][startingPosArr[1]] === 'e' || game.gameboard[startingPosArr[0]][startingPosArr[1]] === 'l') {
        game.clickable = false;
        for (item in game.directions) {
            checkDirection(item, startingPosArr);
            moveCount = 0;
        }

        if (validDirections.length > 0) {
            //add player's piece to board here
            for (var i = 0; i < validDirections.length; i++) {
                flipPieces(validDirections[i], startingPosArr);
            }
            game.gameboard[startingPosArr[0]][startingPosArr[1]] = game.currentPlayer;
            game.currentPlayer = game.getOpponentName();
            game.updateScore(piecesFlipped);
            checkForLegalMoves();
            updateDisplay();
            if (game.mode === 'ai' && game.currentPlayer === 'w'){
              var timer = setTimeout(function(){
                game.clickable = false;
                aiMove();
                game.clickable = true;
                clearTimeout(timer);
              }, 1800);

            } else {
              game.clickable = true;
            }
            return true
        } else {
            game.clickable = true;
            return false;
        }

        function checkDirection(direction, startPoint) {//direction is a string (a valid key the obj)
            var currentPos = startPoint.slice();
            var newPos = [currentPos[0] + game.directions[direction][0], currentPos[1] + game.directions[direction][1]];
            if (newPos[0] < 8 && newPos[1] < 8 && newPos[0] >= 0 && newPos[1] >= 0){
              if (game.gameboard[newPos[0]][newPos[1]] === game.getOpponentName()) {
                  moveCount++;
                  checkDirection(direction, newPos);
              } else if (game.gameboard[newPos[0]][newPos[1]] === game.currentPlayer && moveCount > 0) {
                  validDirections.push(direction);
                  return true;
              } else {
                  return false;

              }
            }

        }


        function flipPieces(direction, startPoint) {//direction is a string (from validDirections)
            var currentPos = startPoint.slice();
            var newPos = [currentPos[0] + game.directions[direction][0], currentPos[1] + game.directions[direction][1]];
            if (game.gameboard[newPos[0]][newPos[1]] === game.getOpponentName()) {
                game.gameboard[newPos[0]][newPos[1]] = game.currentPlayer;
                piecesFlipped++;
                flipPieces(direction, newPos);

            }
        }
    }

}

function passBtn() {
    if (game.currentPlayer === 'w') {
        game.currentPlayer = 'b';

    } else {
        game.currentPlayer = 'w';
        if (game.mode === 'ai'){
          checkForLegalMoves();
          var timer = setTimeout(function(){
            game.clickable = false;
            aiMove();
            game.clickable = true;
            clearTimeout(timer);
          }, 1800);
        }
    }
    updateDisplay();
}


function checkSameRound() {
    if(game.passButtClick === 0){
        game.passButtClick++;
        game.playerOneScore = game.score.b;
        game.playerTwoScore = game.score.w;
        passBtn();
    }else if(game.passButtClick === 1){
        game.newPlayerOneScore = game.score.b;
        game.newPlayerTwoScore = game.score.w;

        if(game.newPlayerOneScore === game.playerOneScore && game.newPlayerTwoScore === game.playerTwoScore){
            checkWinState();
            game.passButtClick=0;
        }
    }
}


function closeModalAndReset() {
  $('.modal').hide();
  resetGame();
}
