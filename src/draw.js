import {
    BALL_RADIUS,
    BRICKS_TOP_SPACING,
    BRICKS_TOTAL_HEIGHT,
    BRICKS_TOTAL_WIDTH,
    BRICK_COLUMN,
    BRICK_HEIGHT,
    BRICK_HORIZONTAL_SPACING,
    BRICK_ROW,
    BRICK_VERTICAL_SPACING,
    BRICK_WIDTH,
    GAME_PANEL_HEIGHT,
    GAME_PANEL_WIDTH,
    ITEMS_SCENE_HEIGHT,
    ITEMS_SCENE_WIDTH,
    PADDLE_HEIGHT,
    PADDLE_WIDTH,
    STATUS_FAILED,
    STATUS_FINISHED,
    WALL_HEIGHT,
    WALL_WIDTH,
} from './game_config';
import { STATUS_READY } from './game_config';

function drawBrick(context, brick) {
    context.beginPath();
    context.fillStyle = 'royalblue';
    context.rect(brick.x, brick.y, brick.width, brick.height);
    context.fill();
    context.closePath();
}

function drawBricks(context, bricks) {
    bricks.forEach((brick) => {
        drawBrick(context, brick);
    });
}

function drawPaddle(context, paddle) {
    context.beginPath();
    context.fillStyle = 'green';
    context.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    context.fill();
    context.closePath();
}

function drawBall(context, ball) {
    context.beginPath();
    context.fillStyle = 'black';
    context.arc(ball.x, ball.y, ball.radius, 0, 360);
    context.fill();
    context.closePath();
}

function drawWall(context, wall) {
    context.beginPath();
    context.fillStyle = 'orange';
    context.rect(wall.x, wall.y, wall.width, wall.height);
    context.fill();
    context.closePath();
}

function informationPanelInfo() {
    const halfColumn = (BRICK_COLUMN / 2) | 0;
    const restColumn = BRICK_COLUMN - halfColumn;
    const halfRow = (BRICK_ROW / 2) | 0;
    const restRow = BRICK_ROW - halfRow;
    const PANEL_WIDTH = halfColumn * BRICK_WIDTH + (halfColumn + 1) * BRICK_HORIZONTAL_SPACING;
    const PANEL_HEIGHT = halfRow * BRICK_HEIGHT + (halfRow + 1) * BRICK_VERTICAL_SPACING;
    const startColumn = (restColumn / 2) | 0;
    const startRow = (restRow / 2) | 0;
    const startX = WALL_WIDTH + startColumn * BRICK_WIDTH + (startColumn - 1) * BRICK_HORIZONTAL_SPACING;
    const startY = BRICKS_TOP_SPACING + startRow * BRICK_HEIGHT + (startRow - 1) * BRICK_VERTICAL_SPACING;

    return [startX, startY, PANEL_WIDTH, PANEL_HEIGHT];
}

function drawWelcomeTo(context) {
    const [startX, startY, PANEL_WIDTH, PANEL_HEIGHT] = informationPanelInfo();
    context.save();
    context.translate(startX, startY);
    context.clearRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT);
    context.font = 'bold 16px solid';
    context.fillStyle = 'grad';
    context.textAlign = 'center';
    const lineOne = '🙂Welcome to Breakout Game🙃';
    const lineTwo = "Press key '<' or '> to move paddle😜";
    const lineThree = 'Good Enjoy!😘😋';
    context.fillText(lineOne, PANEL_WIDTH / 2, PANEL_HEIGHT / 3);
    context.fillText(lineTwo, PANEL_WIDTH / 2, PANEL_HEIGHT / 2);
    context.fillText(lineThree, PANEL_WIDTH / 2, (PANEL_HEIGHT * 4) / 6);
    context.restore();
}

function drawFinishedGame(context, score) {
    const [startX, startY, PANEL_WIDTH, PANEL_HEIGHT] = informationPanelInfo();
    context.save();
    context.translate(startX, startY);
    context.clearRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT);
    context.font = 'bold 16px solid';
    context.fillStyle = 'grad';
    context.textAlign = 'center';
    const lineOne = 'Well, you have ending the game😆';
    const lineTwo = `You have got score: ${score}😘`;
    const lineThree = 'Replay the game after 5 seconds ...😜';
    context.fillText(lineOne, PANEL_WIDTH / 2, PANEL_HEIGHT / 3);
    context.fillText(lineTwo, PANEL_WIDTH / 2, PANEL_HEIGHT / 2);
    context.fillText(lineThree, PANEL_WIDTH / 2, (PANEL_HEIGHT * 4) / 6);
    context.restore();
}

function drawFailedGame(context, score) {
    const [startX, startY, PANEL_WIDTH, PANEL_HEIGHT] = informationPanelInfo();
    context.save();
    context.translate(startX, startY);
    context.clearRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT);
    context.font = 'bold 16px solid';
    context.fillStyle = 'grad';
    context.textAlign = 'center';
    const lineOne = 'Sorry, you have failed to fit the game😭';
    const lineTwo = `You have got score: ${score}😪`;
    const lineThree = 'Replay the game after 5 seconds ...👏';
    context.fillText(lineOne, PANEL_WIDTH / 2, PANEL_HEIGHT / 3);
    context.fillText(lineTwo, PANEL_WIDTH / 2, PANEL_HEIGHT / 2);
    context.fillText(lineThree, PANEL_WIDTH / 2, (PANEL_HEIGHT * 4) / 6);
    context.restore();
}

function drawScore(context, score) {
    context.save();
    context.clearRect(WALL_WIDTH, 0, ITEMS_SCENE_WIDTH, BRICKS_TOP_SPACING);
    context.font = 'bold 24px solid';
    context.textAlign = 'left';
    context.fillText(`score: ${score}`, WALL_WIDTH, BRICKS_TOP_SPACING / 2);
    context.restore();
}

function createBricks() {
    let bricks = [];
    const rows = BRICK_ROW;
    const columns = BRICK_COLUMN;
    const startX = WALL_WIDTH + (ITEMS_SCENE_WIDTH - BRICKS_TOTAL_WIDTH) / 2;
    const deltaX = (col) => {
        return startX + col * BRICK_HORIZONTAL_SPACING;
    };
    const startY = BRICKS_TOP_SPACING;
    const deltaY = (row) => {
        return startY + row * BRICK_VERTICAL_SPACING;
    };
    for (let i = 0; i < rows; ++i) {
        for (let j = 0; j < columns; ++j) {
            bricks.push({
                x: j * BRICK_WIDTH + deltaX(j),
                y: i * BRICK_HEIGHT + deltaY(i),
                width: BRICK_WIDTH,
                height: BRICK_HEIGHT,
            });
        }
    }
    return bricks;
}

function createWalls(context) {
    const leftWall = {
        x: 0,
        y: 0,
        width: WALL_WIDTH,
        height: WALL_HEIGHT,
    };

    const rightWall = {
        x: GAME_PANEL_WIDTH - WALL_WIDTH,
        y: 0,
        width: WALL_WIDTH,
        height: WALL_HEIGHT,
    };

    drawWall(context, leftWall);
    drawWall(context, rightWall);
}

function initState() {
    console.log('initState');
    const paddle = {
        x: WALL_WIDTH + (ITEMS_SCENE_WIDTH - PADDLE_WIDTH) / 2,
        y: ITEMS_SCENE_HEIGHT - PADDLE_HEIGHT,
        width: PADDLE_WIDTH,
        height: PADDLE_HEIGHT,
    };

    const ballMinX = WALL_WIDTH + BALL_RADIUS;
    const ballMaxX = GAME_PANEL_WIDTH - ballMinX;
    const ballX = ballMinX + Math.random() * (ballMaxX - ballMinX);
    const ballMinY = BRICKS_TOP_SPACING + BRICKS_TOTAL_HEIGHT + BALL_RADIUS;
    const ballMaxY = paddle.y - BALL_RADIUS;
    const ballY = ballMinY + Math.random() * (ballMaxY - ballMinY);
    const ball = {
        x: ballX,
        y: ballY,
        radius: BALL_RADIUS,
        direction: {
            x: 2,
            y: 2,
        },
    };

    return {
        status: STATUS_READY,
        score: 0,
        bricks: createBricks(),
        paddle,
        ball,
    };
}

function drawGameScene(context, { status, score, bricks, paddle, ball }) {
    context.clearRect(0, 0, GAME_PANEL_WIDTH, GAME_PANEL_HEIGHT);
    createWalls(context);
    drawBricks(context, bricks);
    drawPaddle(context, paddle);
    drawBall(context, ball);
    drawScore(context, score);
    if (status == STATUS_READY) {
        drawWelcomeTo(context);
    }

    if (status == STATUS_FINISHED) {
        drawFinishedGame(context, score);
    }

    if (status == STATUS_FAILED) {
        drawFailedGame(context, score);
    }
}

export { initState, drawGameScene };
