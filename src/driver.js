import {
    animationFrameScheduler,
    merge,
    interval,
    scan,
    map,
    fromEvent,
    withLatestFrom,
    startWith,
    distinctUntilChanged,
    Subject,
    mergeMap,
} from 'rxjs';
import { timer, of, concat, race, skip } from 'rxjs';
import { isBallHitBrick, isBallHitPaddle, isBallHitWalls, isBallOutOfRange } from './collision';
import { initState } from './draw';
import {
    ADJACENT_HIT_SCORE,
    BRICKS_TOP_SPACING,
    GAME_PANEL_HEIGHT,
    GAME_PANEL_WIDTH,
    ITEMS_SCENE_WIDTH,
    PADDLE_OFFSET,
    SINGLE_HIT_SCORE,
    WALL_WIDTH,
} from './game_config';
import {
    STATUS_READY,
    STATUS_RUNING,
    STATUS_FINISHED,
    STATUS_FAILED,
    READY_TO_START_INTERVAL,
    BALL_SPEED,
} from './game_config';

const PERFECT_FPS = 1000 / 16;
const timer$ = interval(PERFECT_FPS, animationFrameScheduler).pipe(
    scan(
        ({ deltaTime, currTime }, value) => {
            return {
                deltaTime: Date.now() - currTime,
                currTime: Date.now(),
            };
        },
        { deltaTime: 0, currTime: Date.now() },
    ),
);

const PADDLE_KEY_OFFEST = {
    ArrowLeft: -1,
    ArrowRight: 1,
};

const event$ = merge(
    fromEvent(document, 'keydown').pipe(
        map((event) => {
            return PADDLE_KEY_OFFEST[event.key] | 0;
        }),
    ),
    fromEvent(document, 'keyup').pipe(
        map((event) => {
            return 0;
        }),
    ),
).pipe(startWith(0), distinctUntilChanged());

function updateBall(ball, collision) {
    let newBall = ball;
    if (collision.isBallHitPaddle || collision.isBallHitBrick) {
        newBall.direction.y *= -1;
    }

    if (collision.isBallHitWalls) {
        newBall.direction.x *= -1;
    }

    newBall.x = newBall.x + newBall.direction.x * BALL_SPEED;
    newBall.y = newBall.y + newBall.direction.y * BALL_SPEED;

    return newBall;
}

function createDriver() {
    const readyToStart$ = timer(READY_TO_START_INTERVAL).pipe(
        map(() => {
            console.log('begin');
            return STATUS_RUNING;
        }),
    );
    const status$ = concat(
        of(STATUS_READY),
        race(
            readyToStart$,
            event$.pipe(
                skip(1),
                map(() => STATUS_RUNING),
            ),
        ),
    );
    let starter = {};
    starter.driver$ = merge(
        of(0).pipe(
            mergeMap((value) => {
                starter.restart$ = new Subject();
                return starter.restart$;
            }),
        ),
        of(0).pipe(
            mergeMap((value) => {
                return timer$.pipe(withLatestFrom(event$, status$)).pipe(
                    scan(({ status, score, bricks, paddle, ball }, [{ deltaTime, currTime }, offset, preStatus]) => {
                        if (preStatus == STATUS_READY) {
                            return {
                                status,
                                score,
                                bricks,
                                paddle,
                                ball,
                            };
                        }
                        const newPaddle = {
                            x: paddle.x + offset * PADDLE_OFFSET,
                            y: paddle.y,
                            width: paddle.width,
                            height: paddle.height,
                        };
                        newPaddle.x = newPaddle.x < WALL_WIDTH ? WALL_WIDTH : newPaddle.x;
                        newPaddle.x =
                            newPaddle.x > ITEMS_SCENE_WIDTH + WALL_WIDTH - newPaddle.width
                                ? ITEMS_SCENE_WIDTH + WALL_WIDTH - newPaddle.width
                                : newPaddle.x;
                        const [ballHitLeftWall, ballHitRightWall] = isBallHitWalls(ball, [
                            { x: 0, width: WALL_WIDTH },
                            { x: GAME_PANEL_WIDTH - WALL_WIDTH, width: WALL_WIDTH },
                        ]);
                        const [ballOutOfBottom, ballOutOfTop] = isBallOutOfRange(ball, [
                            BRICKS_TOP_SPACING,
                            GAME_PANEL_HEIGHT,
                        ]);
                        const collision = {
                            isBallHitPaddle: isBallHitPaddle(ball, newPaddle),
                            isBallHitBrick: false,
                            isBallHitWalls: ballHitLeftWall || ballHitRightWall,
                            isBallOutOfBottom: ballOutOfBottom,
                            isBallOutOfTop: ballOutOfTop,
                        };
                        let totalHit = 0;
                        const newBricks = bricks.filter((brick) => {
                            const ballHitBrick = isBallHitBrick(ball, brick);
                            totalHit += ballHitBrick ? 1 : 0;
                            collision.isBallHitBrick |= ballHitBrick;
                            return !ballHitBrick;
                        });
                        let newScore = score + totalHit * SINGLE_HIT_SCORE;
                        for (let i = totalHit - 1; i > 0; --i) {
                            newScore += i * ADJACENT_HIT_SCORE;
                        }
                        const newBall = updateBall(ball, collision);
                        status = preStatus;
                        status = newBricks.length == 0 ? STATUS_FINISHED : status;
                        status = collision.isBallOutOfBottom ? STATUS_FINISHED : status;
                        status = collision.isBallOutOfTop ? STATUS_FAILED : status;
                        return {
                            status: status,
                            score: newScore,
                            bricks: newBricks,
                            paddle: newPaddle,
                            ball: newBall,
                        };
                    }, initState()),
                );
            }),
        ),
    );

    return starter;
}

export { createDriver };
