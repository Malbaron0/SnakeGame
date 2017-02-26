$(document).ready(function() {
      //Draw the canvas
      var canvas = document.querySelector('#canvas');
      var startGame = document.querySelector('#startGame');

      var ctx = canvas.getContext('2d');
      var canvasWidth = canvas.width;
      var canvasHeight = canvas.height;
      ctx.strokeStyle = "white";

      var cellWidth = 10;
      
      var snake;
      var direction;
      var food;
      var score;
      var gameInterval;
      var fps = 2800/60;

      //Make snake array
      function createSnakeArray() {
            var snakeLength = 5;
            snake = [];

            for (var i = snakeLength - 1; i >= 0; i--) {
                  snake.push({
                        x: i,
                        y: 0
                  });
            }
      }


      function start() {
            direction = "right";
            createSnakeArray();
            generateFood();
            score = 0;
            window.requestAnimationFrame(paintSnakeArray)
            
            //clearInterval(gameInterval); //reset interval
            //gameInterval = setInterval(paintSnakeArray, 60);
          
            

      }

      function colorCell(x, y) {
            ctx.fillStyle = "black"
            ctx.fillRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
            ctx.strokeStyle = "white"
            ctx.strokeRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
      }

      function paintSnake() {
            for (var i = 0; i < snake.length; i++) {
                  colorCell(snake[i].x, snake[i].y);
            }
      }

      function paintSnakeArray() {

            //redraw canvas to refresh animation
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            ctx.strokeStyle = "black";
            ctx.strokeRect(0, 0, canvasWidth, canvasHeight);


            //get head of snake
            var headx = snake[0].x
            var heady = snake[0].y

            if (direction == "left")
                  headx--;
            else if (direction == "right")
                  headx++;
            else if (direction == "down")
                  heady++;
            else if (direction == "up")
                  heady--;

            /*
            check for out of bounds, if thats the case, restart the array by calling createSnakeArray and setting
            default direstion.
             */
            if (headx == canvasWidth / cellWidth || heady == canvasHeight / cellWidth || headx == -1 || heady == -1 || check_collision(headx, heady)) {
                  startGame.style.display = 'initial'; //show button
                  //clearInterval(gameInterval); //stop the loop and return
                  clearTimeout(gameInterval);
                  return;
            }

            //if the head of the snake meets the food, add that location to the head and generate another food
            if (food.x == headx && food.y == heady) {

                  var tail = {
                        x: headx,
                        y: heady,
                  }
                  generateFood();
                  score++;

            } else {

                  //pop the tail
                  var tail = snake.pop();
                  //move the head to the tail. 
                  tail.x = headx;
                  tail.y = heady;
            }

            snake.unshift(tail);

            //paint the food
            colorCell(food.x, food.y);

            //paint the snake
            paintSnake();

            //show score by using filltext
            ctx.fillText("Score: " + score, 10, canvasHeight - 10);

            gameInterval = setTimeout(function(){
                  window.requestAnimationFrame(paintSnakeArray)

            }, fps);

      }


      /*
      Check to see if the head of the snake doesnt collide with the body
       */
      function check_collision(x, y) {
            for (var i = 0; i < snake.length; i++) {
                  if (snake[i].x == x && snake[i].y == y)
                        return true;
            }
            return false;
      }

      document.addEventListener('keydown', function(e) {
            
            if (e.keyCode == 37 && direction != "right")
                  direction = "left";

            else if (e.keyCode == 38 && direction != "down")
                  direction = "up";

            else if (e.keyCode == 39 && direction != "left")
                  direction = "right";

            else if (e.keyCode == 40 && direction != "up")
                  direction = "down";

      })

      function generateFood() {

            food = {
                  x: Math.floor(Math.random() * (canvasWidth / cellWidth - cellWidth)),
                  y: Math.floor(Math.random() * (canvasHeight / cellWidth - cellWidth)),
            };
      }

      //Start the game and hide the button
      startGame.addEventListener('click', function(event){
            start();
            startGame.style.display = 'none';
      });

});