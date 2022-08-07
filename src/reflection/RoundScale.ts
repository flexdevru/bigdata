import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import {AssetsManager} from '../managers/AssetsManager';

export class RoundScale extends PIXI.Sprite {
    private score_label: PIXI.Text;
    private graph: PIXI.Graphics;
    private _draw: number = 0;

    constructor() {
        super();

        this.texture = AssetsManager.instance.getTexture('round_scale');

        this.graph = new PIXI.Graphics();
        this.addChild(this.graph);

        this.score_label = new PIXI.Text('100%', {fontFamily: 'Regular', fontSize: 49.64, fill: 0xff2e2e});
        this.addChild(this.score_label);
        this.score_label.position.set(this.width / 2, this.height / 2);
        this.score_label.anchor.set(0.5, 0.5);
    }

    public start = (value: number) => {
        value = Math.floor(value * 100);
        this.draw = 0;

        this.score_label.text = '0%';
        this.score_label.style.fill = 0xff2e2e;

        gsap.to(this, {duration: 2, draw: value, ease: 'none'});
    }

    private set draw(value: number) {
        this._draw = Math.floor(value);

        this.graph.clear();
        this.graph.lineStyle(1, (value < 80) ? 0xff2e2e : 0x3d6efd);

        for (let i: number = 0; i < value; i++) {
            let _x1: number = Math.sin(i * Math.PI * 2 / 100) * 88 + this.width / 2;
            let _y1: number = this.height / 2 - Math.cos(i * Math.PI * 2 / 100) * 88;

            let _x2: number = Math.sin(i * Math.PI * 2 / 100) * 77 + this.width / 2;
            let _y2: number = this.height / 2 - Math.cos(i * Math.PI * 2 / 100) * 77;

            this.graph.moveTo(_x1, _y1);
            this.graph.lineTo(_x2, _y2);
        }

        this.score_label.text = Math.floor(value).toString() + '%';
        if (value >= 80) this.score_label.style.fill = 0x3d6efd;
    }

    private get draw(): number {
        return this._draw;
    }
}