import * as PIXI from 'pixi.js';
import {Reflection} from './Reflection';
import {GraphicsHelper} from '../utils/Utils';
import {Application} from '../Application';
import {RoundScale} from './RoundScale';
import {ImageMarginButton} from '../buttons/ImageMarginButton';
import {AssetsManager} from '../managers/AssetsManager';

export class ReflectionRight extends Reflection {
    private roundScale: RoundScale;
    private wnd: PIXI.Sprite;

    constructor() {
        super();

        this.addChild(GraphicsHelper.createRect(Application.WIDTH, Application.HEIGHT, 0x000000, 0.7));
        this.wnd = new PIXI.Sprite();
        this.addChild(this.wnd).position.set(676, 74);

        this.roundScale = new RoundScale();
        this.addChild(this.roundScale).position.set(854, 346);

        let btn_retry: ImageMarginButton = new ImageMarginButton('btn_retry');
        this.addChild(btn_retry).position.set(676 + 87, 861);
        btn_retry.addListener('pointerdown', this.onRetryButtonClick);

        let btn_next: ImageMarginButton = new ImageMarginButton('btn_next');
        this.addChild(btn_next).position.set(676 + 374, 861);
        btn_next.addListener('pointerdown', this.onNextButtonClick);

        let btn_results: ImageMarginButton = new ImageMarginButton('btn_results');
        this.addChild(btn_results).position.set(676 + 389 - 299, 695);
        btn_results.addListener('pointerdown', this.onResultsClick);

        this.interactive = true;
    }

    public show(score: number = -1) {
        super.show(score);
        /*if (Game.ROUND < 3) this.wnd.texture= AssetsManager.instance.getTexture('reflection_right');
        else this.wnd.texture = AssetsManager.instance.getTexture('reflection_right_final');
        */
    }

    private onRetryButtonClick = () => {
        this.emit('retry', this);
    }

    private onResultsClick = () => {
        this.emit('results', this);
    }

    private onNextButtonClick = () => {
        this.emit('next', this);
    }

    public show_score = () => {
        this.roundScale.start(this.score);
    }
}