import * as PIXI from 'pixi.js';
import {Application} from '../Application';
import {ImageMarginButton} from '../buttons/ImageMarginButton';
import {AssetsManager} from '../managers/AssetsManager';
import {GraphicsHelper} from '../utils/Utils';
import {Reflection} from './Reflection';
import {RoundScale} from './RoundScale';

export class ReflectionWrong extends Reflection {
    private roundScale: RoundScale;

    constructor() {
        super();

        this.addChild(GraphicsHelper.createRect(Application.WIDTH, Application.HEIGHT, 0x000000, 0.7));

        this.addChild(AssetsManager.instance.getSprite('reflection_wrong')).position.set(676, 74);

        this.roundScale = new RoundScale();
        this.addChild(this.roundScale).position.set(854, 346);


        let btn_retry: ImageMarginButton = new ImageMarginButton('btn_retry');
        this.addChild(btn_retry).position.set(676 + 517 - 299, 730 + 100);
        btn_retry.addListener('pointerdown', this.onRetryButtonClick);

        let btn_results: ImageMarginButton = new ImageMarginButton('btn_results');
        this.addChild(btn_results).position.set(676 + 389 - 299, 908 - 176);
        btn_results.addListener('pointerdown', this.onResultsClick);

        this.interactive = true;
    }

    private onRetryButtonClick = () => {
        this.emit('retry', this);
    }

    private onResultsClick = () => {
        this.emit('results', this);
    }

    public show_score = () => {
        this.roundScale.start(this.score);
    }
}