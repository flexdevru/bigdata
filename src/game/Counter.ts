import * as PIXI from 'pixi.js';
import {Application} from '../Application';
import {AssetsManager} from '../managers/AssetsManager';


export class Counter extends PIXI.Sprite {
    private max: number = 60;
    private current: number = 0;

    private time_label: PIXI.Text;

    constructor() {
        super();
        this.texture = AssetsManager.instance.getTexture('counter');



        this.time_label = new PIXI.Text('60%', {fontFamily: 'Medium', fontSize: 44, fill: 0xea3500, align: 'center'});
        this.addChild(this.time_label).position.set(this.width / 2 + 5, 60);
        this.time_label.anchor.set(0.5, 0);

        let label = new PIXI.Text('ВЕРНЫХ\nОТВЕТОВ', {fontFamily: 'Medium', fontSize: 16.43, fill: 0xffffff, align: 'center'});
        this.addChild(label).position.set(this.width / 2 + 3, 115);
        label.anchor.set(0.5, 0);

        this.position.set(Application.WIDTH - this.width - 6, 27);
    }

    public start = (max: number) => {
        this.max = max;
        this.current = 0;
        this.time_label.text = '0%';
        this.time_label.style.fill = 0xea3500;
    }

    public tick = () => {
        this.current++;
        this.time_label.text = Math.floor(100 * this.current / this.max).toString() + '%';

        if (this.current / this.max < 0.8) this.time_label.style.fill = 0xea3500;
        else this.time_label.style.fill = 0x3d6efd;

    }

    public get score(): number {
        return this.current / this.max;
    }

}