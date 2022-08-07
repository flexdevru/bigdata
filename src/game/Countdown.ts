import gsap from 'gsap';
import * as PIXI from 'pixi.js';
import {Application} from '../Application';
import {AssetsManager} from '../managers/AssetsManager';
import {GraphicsHelper} from '../utils/Utils';

export class Countdown extends PIXI.Container {
    private _time: number = 4;
    private time_label: PIXI.Text;

    constructor() {
        super();

        this.addChild(GraphicsHelper.createRect(Application.WIDTH, Application.HEIGHT, 0x000000, 0.7));
        let back: PIXI.Sprite = AssetsManager.instance.getSprite('countdown');
        back.anchor.set(0.5, 0.5);
        this.addChild(back).position.set(Application.WIDTH / 2, Application.HEIGHT / 2);

        this.time_label = new PIXI.Text('3', {fontFamily: 'Medium', fontSize: 155, fill: 0xfecc5c, align: 'center'});
        this.addChild(this.time_label).position.set(Application.WIDTH / 2, Application.HEIGHT / 2);
        this.time_label.anchor.set(0.5, 0.5);
        this.visible = false;
    }

    public hide = () => {
        gsap.to(this, {duration: 0.5, alpha: 0, onComplete: this.onHideComplete});
    }

    private onHideComplete = () => {
        this.visible = false;
    }

    public start = () => {
        this.time = 4;
        this.visible = true;
        this.alpha = 1;
        gsap.to(this, {duration: 4, time: 0, ease: 'none', onComplete: this.onCountdownComplete});
    }

    private set time(value: number) {
        this._time = value;
        if (value > 1) {
            this.time_label.style.fontSize = 155;
            this.time_label.text = Math.floor(value).toString();
        }
        else {
            this.time_label.style.fontSize = 55;
            this.time_label.text = 'СТАРТ';
        }

        let scale: number = 1 - (value - Math.floor(value));
        this.time_label.scale.set(scale, scale);

    }

    private get time(): number {
        return this._time;
    }

    private onCountdownComplete = () => {
        this.hide();
        this.emit('complete');
    }
}