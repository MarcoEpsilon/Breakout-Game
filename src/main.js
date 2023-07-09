import * as Rx from 'rxjs';
import { initState, drawGameScene } from './draw';
import { GAME_PANEL_HEIGHT, GAME_PANEL_WIDTH, STATUS_FAILED, STATUS_FINISHED } from './game_config';
import { createDriver } from './driver';
function main() {
    console.log('main: call');
    const gameCanvas = document.getElementById('game_panel');
    gameCanvas.setAttribute('width', `${GAME_PANEL_WIDTH}`);
    gameCanvas.setAttribute('height', `${GAME_PANEL_HEIGHT}`);
    const context = gameCanvas.getContext('2d');

    const starter = createDriver();
    starter.driver$
        .pipe(
            Rx.retry({
                delay: (err$) => {
                    console.log(err$);
                    return err$.pipe(Rx.delay(5 * 1000));
                },
            }),
        )
        .subscribe((state) => {
            console.log(state.status);
            drawGameScene(context, state);
            if (state.status == STATUS_FINISHED || state.status == STATUS_FAILED) {
                starter.restart$.error(Rx.of('ending'));
            }
        });
}

const start$ = Rx.fromEvent(window, 'load');
start$.subscribe(main);
