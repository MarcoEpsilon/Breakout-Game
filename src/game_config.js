export const GAME_PANEL_WIDTH = 800;
export const GAME_PANEL_HEIGHT = 600;

export const WALL_WIDTH = 20;
export const WALL_HEIGHT = GAME_PANEL_HEIGHT;

export const ITEMS_SCENE_WIDTH = GAME_PANEL_WIDTH - WALL_WIDTH * 2;
export const ITEMS_SCENE_HEIGHT = GAME_PANEL_HEIGHT;

export const BRICK_ROW = 9;
export const BRICK_COLUMN = 7;

export const BRICK_HORIZONTAL_SPACING = 10;
export const BRICK_VERTICAL_SPACING = 10;

const BRICK_MIN_WIDTH = 100;
const BRICK_MIN_HEIGHT = 30;
const calcBrickWidth = (col) => {
    const spacingWidth = (col - 1) * BRICK_HORIZONTAL_SPACING;
    const brickWidth = Math.min((ITEMS_SCENE_WIDTH - spacingWidth) / BRICK_COLUMN, BRICK_MIN_WIDTH);
    return [brickWidth, brickWidth * BRICK_COLUMN + spacingWidth];
};
const calcBrickHeight = () => {
    const bricksTotalHeight = ITEMS_SCENE_HEIGHT * 0.7;
    const brickHeight = BRICK_MIN_HEIGHT;
    // more change can do from here
    return [brickHeight, bricksTotalHeight];
};
export const BRICKS_TOP_SPACING = 40;
export const [BRICK_WIDTH, BRICKS_TOTAL_WIDTH] = calcBrickWidth(BRICK_COLUMN);
export const [BRICK_HEIGHT, BRICKS_TOTAL_HEIGHT] = calcBrickHeight(BRICK_ROW);

export const PADDLE_WIDTH = 250;
export const PADDLE_HEIGHT = 40;

export const PADDLE_OFFSET = 10;
export const BALL_SPEED = 2;
export const BALL_RADIUS = 25;

export const STATUS_READY = 0;
export const STATUS_RUNING = 1;
export const STATUS_FINISHED = 2;
export const STATUS_FAILED = 3;
export const READY_TO_START_INTERVAL = 5 * 1000;

export const SINGLE_HIT_SCORE = 10;
export const ADJACENT_HIT_SCORE = 5;
