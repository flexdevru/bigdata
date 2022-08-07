import * as PIXI from 'pixi.js';
import gsap from 'gsap';

import {AssetsManager} from '../managers/AssetsManager';

export class Timer extends PIXI.Sprite {
    private ring1: PIXI.Sprite;
    private ring2: PIXI.Sprite;

    private _time: number = 60;
    private time_label: PIXI.Text;

    private blink: number = 0;
    private is_countdown: boolean = false;

    constructor() {
        super();
        this.texture = AssetsManager.instance.getTexture('timer');

        this.ring1 = AssetsManager.instance.getSprite('ring1');
        this.addChild(this.ring1).position.set(this.width / 2, this.height / 2);
        this.ring1.anchor.set(0.5, 0.5);

        this.ring2 = AssetsManager.instance.getSprite('ring2');
        this.addChild(this.ring2).position.set(this.width / 2, this.height / 2);
        this.ring2.anchor.set(0.5, 0.5);

        this.time_label = new PIXI.Text('60', {fontFamily: 'Medium', fontSize: 43, fill: 0xfecc5c, align: 'center'});
        this.addChild(this.time_label).position.set(this.width / 2, 75);
        this.time_label.anchor.set(0.5, 0);

        let label = new PIXI.Text('СЕКУНД', {fontFamily: 'Medium', fontSize: 16.43, fill: 0xffffff, align: 'center'});
        this.addChild(label).position.set(this.width / 2, 124);
        label.anchor.set(0.5, 0);

        this.position.set(9, 3);
    }

    public start = () => {
        this.is_countdown = false;
        this.time_label.style.fill = 0xfecc5c;
        this.time = 61;
        this.ring2.rotation = -Math.PI;
        this.ring1.rotation = 0;

        gsap.to(this.ring2, {duration: 60, rotation: Math.PI, ease: 'none'});
        gsap.to(this.ring1, {duration: 60, rotation: -8 * Math.PI, ease: 'none'});
        gsap.to(this, {duration: 60, time: 0, ease: 'none', onComplete: this.onTimerComplete});
    }

    public start_countdown = () => {
        this.is_countdown = true;
        this.time_label.style.fill = 0xfecc5c;
        this.time = 4;
        this.ring2.rotation = -Math.PI;
        this.ring1.rotation = 0;

        gsap.to(this, {duration: 3, time: 0, ease: 'none', onComplete: this.onCountdownComplete});
    }


    private set time(value: number) {
        this._time = value;
        this.time_label.text = Math.floor(value).toString();

        if (this.is_countdown == true) return;

        if (value < 6) {
            this.time_label.style.fill = 0xea3500;
            if (this.blink == 0) {
                this.blink = setInterval(this.blinkTime, 500);
            }
        }
    }

    private get time(): number {
        return this._time;
    }

    private blinkTime = () => {
        this.time_label.visible = !this.time_label.visible;
    }

    private onCountdownComplete = () => {
        this.emit('countdown_complete');
    }

    private onTimerComplete = () => {
        clearInterval(this.blink);
        this.blink = 0;
        this.time_label.visible = true;

        this.time_label.text = '0';
        this.emit('complete');
    }

    public stop = () => {
        gsap.killTweensOf(this.ring2);
        gsap.killTweensOf(this.ring1);
        gsap.killTweensOf(this);
    }
}