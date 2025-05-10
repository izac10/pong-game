// Obtaining access to the elements from html. 
const startText = document.getElementById('startText'); 
const paddle1 = document.getElementById('paddle1'); 
const paddle2 = document.getElementById('paddle2'); 
const ball = document.getElementById('ball'); 
const player1ScoreElement = document.getElementById('player1Score'); 
const player2ScoreElement = document.getElementById('player2Score'); 
const lossSound = document.getElementById('lossSound');
const wallSound = document.getElementById('wallSound');
const paddleSound = document.getElementById('paddleSound'); 



// Game variables. 
let gameRunning = false; 
let keysPressed= {}; 
let paddle1Speed = 0; 
let paddle2Speed = 0;
let paddle1Y = 150; // This is because the position where the paddle is located is at 150px. We are using the top edge.  
let paddle2Y = 150; 
let ballX = 355; // This is the where the ball is initially located.
let ballSpeedX = 2;  
let ballY = 185; 
let ballSpeedY = 2; 
let player1Score = 0;
let player2Score = 0 ; 


// Game constants. 
const paddleAcceleration =1;
const paddleDeceleration=1;
const maxPaddleSpeed =5; 
const gameHeight = 358; // This is the height of the game area. 
const gameWidth = 730; // This is the width of the game area. 

// When the user press any key, the function startGame() will be called. 
document.addEventListener('keydown', startGame)

// Events for the keys that are currently being pressed. 
document.addEventListener('keydown', handleKeydown)
document.addEventListener('keyup', handleKeyUp)

// Start game func. 
function startGame(){
    gameRunning = true; 
    startText.style.display = 'none';
    document.removeEventListener('keydown',startGame);
    gameLoop(); 
}

function gameLoop(){
    if(gameRunning){
        
        // Left paddle. 
        updatePaddle1();
        // Right paddle. 
        updatePaddle2();
        // Moving the ball; 
        moveBall(); 
        // Loop every 8ms...... 
        setTimeout(gameLoop,6)
    }
}

// Functions that are going to handle the keys when they are pressed. 
function handleKeydown( event){
    keysPressed[event.key] = true;  
}
function handleKeyUp( event){
    keysPressed[event.key] = false;  
}

// Moving left paddle under commands w(up) and s(down). 
function updatePaddle1(){

    // If the key 'w' is being pressed, it's true. 
    if(keysPressed['w']){
        paddle1Speed = Math.max(paddle1Speed - paddleAcceleration, -maxPaddleSpeed); 
    }

    // If 's' is being pressed. 
    else if(keysPressed['s']){
        paddle1Speed = Math.min(paddle1Speed + paddleAcceleration, maxPaddleSpeed); 

    }
    // Otherwise, the paddle will slow down so it doesn't continue to move. 
    else {
        if(paddle1Speed > 0 ){
            paddle1Speed = Math.max(paddle1Speed - paddleDeceleration, 0);
        }else if( paddle1Speed < 0 ){
            paddle1Speed = Math.min(paddle1Speed + paddleDeceleration, 0); 
        }
    }

    // Paddle1Speed will be added to paddle1Y every 8ms. 
    paddle1Y += paddle1Speed; 

    // If the paddle reaches the top of the margin then it will be set to 0 so we can have a top limit. 
    if ( paddle1Y < 0 ){
        paddle1Y = 0; 
    }

    // If the paddle reaches the bottom of the margin then it will be set to (gameHeight - paddle1.clientHeight)
    // so we can have a bottom limit. 
    // Remember that we are using the reference location of paddle1Y with the top edge of the paddle. 
    if( paddle1Y > gameHeight - paddle1.clientHeight ){
        paddle1Y = gameHeight - paddle1.clientHeight
    }

    // Move the paddle1 paddle1Y pixeles. 
    paddle1.style.top = paddle1Y + 'px'; 
}

// Moving right paddle under commands ArrowUp(up) and ArrowDown(down). 
function updatePaddle2(){

    // If the key 'w' is being pressed, it's true. 
    if(keysPressed['ArrowUp']){
        paddle2Speed = Math.max(paddle2Speed - paddleAcceleration, -maxPaddleSpeed); 
    }

    // If 's' is being pressed. 
    else if(keysPressed['ArrowDown']){
        paddle2Speed = Math.min(paddle2Speed + paddleAcceleration, maxPaddleSpeed); 

    }
    // Otherwise, the paddle will slow down so it doesn't continue to move. 
    else {
        if(paddle2Speed > 0 ){
            paddle2Speed = Math.max(paddle2Speed - paddleDeceleration, 0);
        }else if( paddle2Speed < 0 ){
            paddle2Speed = Math.min(paddle2Speed + paddleDeceleration, 0); 
        }
    }

    // Paddle2Speed will be added to paddle2Y every 8ms. 
    paddle2Y += paddle2Speed; 

    // If the paddle reaches the top of the margin then it will be set to 0 so we can have a top limit. 
    if ( paddle2Y < 0 ){
        paddle2Y = 0; 
    }

    // If the paddle reaches the bottom of the margin then it will be set to (gameHeight - paddle2.clientHeight)
    // so we can have a bottom limit. 
    // Remember that we are using the reference location of paddle2Y with the top edge of the paddle. 
    if( paddle2Y > gameHeight - paddle2.clientHeight ){
        paddle2Y = gameHeight - paddle2.clientHeight
    }

    // Move the paddle2 paddle2Y pixeles. 
    paddle2.style.top = paddle2Y + 'px'; 
}

// Once the game begins the ball will be moving incrementing its position every 8ms inside the loop. 
function moveBall(){

    // Giving to the ball some new locations. 
    ballX += ballSpeedX; 
    ballY += ballSpeedY; 

    // Setting boundaries for the top and bottom area so the ball can stay inside the game area. 
    // Hitting the walls.
    if( ballY >= gameHeight - ball.clientHeight || ballY <=0){

        // Changing the direction of the ball so "it bounces"
        ballSpeedY = - ballSpeedY;
        playSound(wallSound); 
    }
 
    // Setting boundary if the ball hit the paddle2. 
    if( ballX >= gameWidth - paddle2.clientWidth - ball.clientWidth  && ballY >= paddle2Y && ballY <= paddle2Y + paddle2.clientHeight){
        // Changing the direction. 
        ballSpeedX = -ballSpeedX; 
        playSound(paddleSound); 
    }

    // Setting boundary if the ball hit paddle1.  
    if( ballX <= paddle1.clientWidth && ballY >= paddle1Y && ballY <= paddle1Y + paddle1.clientHeight){
        // Changing the direction. 
        ballSpeedX = -ballSpeedX; 
        playSound(paddleSound); 
    }

    // Out of area to the left( GOALLLLLLLL)
    if( ballX <=0){
        player2Score++;
        updateScoreboard();
        resetBall(); 
        pauseBall();
        resetPaddles();
        playSound(lossSound); 
    }

    // Out of area to the right( GOALLLLLLLL)
    else if( ballX >= gameWidth - ball.clientWidth){
        player1Score++; 
        updateScoreboard(); 
        resetBall();
        pauseBall(); 
        resetPaddles();
        playSound(lossSound); 
    }

    // Finally, just update it! 
    ball.style.left = ballX + 'px'; 
    ball.style.top = ballY + 'px'; 
}

// Updating the number on the scoretable. 
function updateScoreboard(){
    player1ScoreElement.textContent = player1Score; 
    player2ScoreElement.textContent = player2Score; 
}


// Reseting the ball to the middle field. 
function resetBall(){
    ballX = gameWidth /2 - ball.clientWidth /2; 
    ballY = gameHeight /2 - ball.clientHeight /2; 

    // Reseting the movement of the ball to a random location. 
    ballSpeedX = Math.random () > 0.5 ? 2 : -2 ;
    ballSpeedY = Math.random () > 0.5 ? 2 : -2 ;

}

// After a goal, this function will stop the game and after pressing any key it will start again. 
function pauseBall(){

    // Stop the game. 
    gameRunning = false; 
    document.addEventListener('keydown',startGame); 

}

function playSound( sound){
    sound.currentTime = 0; 
    sound.play();
}

// Restarting the game without reloading the page. 
function restartGame(){

    // Stop the game. 
    gameRunning = false;
    resetBall();
    moveBall();
    resetPaddles();  
    player1Score = 0;
    player2Score = 0; 
    updateScoreboard();  
    startText.style.display = '';
    document.addEventListener('keydown',startGame); 
}

function resetPaddles(){
    paddle1Y =150; 
    paddle2Y = 150; 
    updatePaddle1();
    updatePaddle2(); 
}











