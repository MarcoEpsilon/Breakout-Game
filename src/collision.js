import { BALL_RADIUS, BALL_SPEED } from './game_config';

function isBallHitPaddle(ball, paddle) {
    const ballNextX = ball.x + ball.direction.x * BALL_SPEED;
    const isXRange = ballNextX + BALL_RADIUS >= paddle.x && ballNextX - BALL_RADIUS <= paddle.x + paddle.width;
    const ballNextY = ball.y + ball.direction.y * BALL_SPEED;
    const isYRange = ballNextY + BALL_RADIUS >= paddle.y;

    return isXRange && isYRange;
}

function isBallHitBrick(ball, brick) {
    const ballNextX = ball.x + ball.direction.x * BALL_SPEED;
    const isXRange = ballNextX + BALL_RADIUS >= brick.x && ballNextX - BALL_RADIUS <= brick.x + brick.width;
    const ballNextY = ball.y + ball.direction.y * BALL_SPEED;
    const isYRange = ballNextY + BALL_RADIUS >= brick.y && ballNextY - BALL_RADIUS <= brick.y + brick.height;

    return isXRange && isYRange;
}

function isBallHitWalls(ball, [leftWall, rightWall]) {
    const ballNextX = ball.x + ball.direction.x * BALL_SPEED;
    const isHitLeftWall = ballNextX - BALL_RADIUS <= leftWall.x + leftWall.width;
    const isHitRightWall = ballNextX + BALL_RADIUS >= rightWall.x;

    return [isHitLeftWall, isHitRightWall];
}

function isBallOutOfRange(ball, [bottom, top]) {
    const ballNextY = ball.y + ball.direction.y * BALL_SPEED;

    const isOutOfBottom = ballNextY - BALL_RADIUS < bottom;
    const isOutOfTop = ballNextY + BALL_RADIUS > top;

    return [isOutOfBottom, isOutOfTop];
}
export { isBallHitPaddle, isBallHitBrick, isBallHitWalls, isBallOutOfRange };
