import gsap from 'gsap';
import * as PIXI from 'pixi.js';

export class Reflection extends PIXI.Container {
    public score: number = 0;

    constructor() {
        super();
        this.visible = false;
        this.alpha = 0;
    }

    public show(score: number = -1) {
        if (score != -1) this.score = score;
        this.show_score();

        this.visible = true;
        gsap.to(this, {duration: 0.5, alpha: 1});
    }

    public show_score = () => {

    }

    public hide = () => {
        gsap.to(this, {duration: 0.5, alpha: 0, onComplete: this.onHideComplete});
    }

    private onHideComplete = () => {
        this.visible = false;
    }
}