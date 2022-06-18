import Layout from '../../components/layout';
import Head from 'next/head';
import Script from 'next/script'

export default function BreakOut() {
  return (
    <Layout>
      <Head>
        <title>{'Breakout'}</title>
      </Head>
      <body>
        <div id="root"></div>
        <canvas
          id="myCanvas"
          width={500}
          height={500}
          style={{
            border: '2px solid #000',
            marginTop: 10,
          }}></canvas>
          <Script  dangerouslySetInnerHTML={{
    __html: `var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    let x = canvas.width/2;
    let y = canvas.height-30;
    var ballRadius = 10;
    let dx = generateRandom();
    let dy = -4;
    var paddleHeight = 10;
    var paddleWidth = 100;
    var paddleX = (canvas.width-paddleWidth) / 2;
    var rightPressed = false;
    var leftPressed = false;
    var brickRowCount = 5;
    var brickColumnCount = 11;
    var brickWidth = 75;
    var brickHeight = 20;
    var brickPadding = 10;
    var brickOffsetTop = 30;
    var brickOffsetLeft = 30;
    var score = 0;
    var lives = 3;

    var bricks = [];
    for(var c=0; c<brickColumnCount; c++) {
        bricks[c] = [];
        for(var r=0; r<brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }

    function generateRandom(min = -5, max = 5) {
        // find diff
        let difference = max - min;

        // generate random number 
        let rand = Math.random();

        // multiply with difference 
        rand = Math.floor( rand * difference);

        // add with min value 
        rand = rand + min;

        return rand;
    }

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);
    document.addEventListener('touchstart', handleTouchEvent, true);
    document.addEventListener('touchmove', handleTouchEvent, true);
    document.addEventListener('touchend', handleTouchEvent, true);
    document.addEventListener('touchcancel', handleTouchEvent, true);

    // will adjust ship's x to latest touch
    function handleTouchEvent(e) {
        if (e.touches.length === 0 ) return;
        e.preventDefault();
        e.stopPropagation();
        var touch = e.touches[0];
        var relativeX = touch.pageX - canvas.offsetLeft;
        if(relativeX > 0 && relativeX < canvas.width ) {
            paddleX = relativeX - paddleWidth/2;
        }
    }

    function keyDownHandler(e) {
        if(e.key == "Right" || e.key == "ArrowRight" || e.key == "d") {
            rightPressed = true;
        }
        else if(e.key == "Left" || e.key == "ArrowLeft" || e.key == "a") {
            leftPressed = true;
        }
    }
    function keyUpHandler(e) {
        if(e.key == "Right" || e.key == "ArrowRight" || e.key == "d") {
            rightPressed = false;
        }
        else if(e.key == "Left" || e.key == "ArrowLeft" || e.key == "a") {
            leftPressed = false;
        }
    }
    function mouseMoveHandler(e) {
        var relativeX = e.clientX - canvas.offsetLeft;
        
        if(relativeX > 0 && relativeX < canvas.width ) {
            paddleX = relativeX - paddleWidth/2;
        }
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI*2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }
    function drawLives() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Lives: "+lives, canvas.width-65, 20);
    }
    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }
    function drawBricks() {
        for(var c=0; c<brickColumnCount; c++) {
            for(var r=0; r<brickRowCount; r++) {
                if(bricks[c][r].status == 1) {
                    var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                    var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = "#0095DD";
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    function drawScore() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Score: "+score, 8, 20);
    }

    function collisionDetection() {
        for(var c=0; c<brickColumnCount; c++) {
            for(var r=0; r<brickRowCount; r++) {
                var b = bricks[c][r];
                if(b.status == 1) {
                    if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                        dy = -dy;
                        b.status = 0;
                        score++;
                        if(score == brickRowCount*brickColumnCount) {
                            alert("YOU WIN, CONGRATULATIONS!");
                            document.location.reload();
                        }
                    }
                }
            }
        }
    }   

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        drawScore();
        drawLives();
        collisionDetection();
        if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if(y + dy < ballRadius) {
            dy = -dy;
        } else if(y + dy > canvas.height-ballRadius) {
            if(x > paddleX && x < paddleX + paddleWidth) {
                dx = dx == 0 ? dx + 1: dx;
                dy = -dy;
            }
            else {
                lives--;
                if(!lives) {
                    alert("GAME OVER");
                    document.location.reload();
                }
                else {
                    x = canvas.width/2;
                    y = canvas.height-30;
                    dx = generateRandom();
                    dy = -3;
                    paddleX = (canvas.width-paddleWidth)/2;
                }
            }
        }
        if(rightPressed) {
            paddleX += 5;
            if (paddleX + paddleWidth > canvas.width){
                paddleX = canvas.width - paddleWidth;
            }
        }
        else if(leftPressed) {
            paddleX -= 5;
            if (paddleX < 0){
                paddleX = 0;
            }
        }
        x += dx;
        y += dy;
        requestAnimationFrame(draw);
    }
    draw();`,}}/>
      </body>
    </Layout>
  );
}
