import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import {ImageMarginButton} from '../buttons/ImageMarginButton';
import {AssetsManager} from '../managers/AssetsManager';

export class Tutorial extends PIXI.Container {
    constructor() {
        super();
        this.visible = false;
        this.alpha = 0;

        this.addChild(AssetsManager.instance.getSprite('tutorial'));

        let btn_next: ImageMarginButton = new ImageMarginButton('btn_tutorial_close');
        this.addChild(btn_next).position.set(1518, 951);
        btn_next.addListener('press', this.onClick);
    }

    public show = () => {
        this.visible = true;
        gsap.to(this, {duration: 0.5, alpha: 1});
    }

    public hide = () => {
        gsap.to(this, {duration: 0.5, alpha: 0, onComplete: this.onHideComplete});
    }

    private onHideComplete = () => {
        this.visible = false;
    }

    private onClick = () => {
        this.emit('complete');
    }
}