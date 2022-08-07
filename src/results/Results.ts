import gsap from 'gsap';
import * as PIXI from 'pixi.js';
import {Application} from '../Application';
import {ImageMarginButton} from '../buttons/ImageMarginButton';
import {AssetsManager} from '../managers/AssetsManager';
import {GraphicsHelper, rgba_create, TextureHelper} from '../utils/Utils';
import {ResultItem} from './ResultItem';
import {Scroller} from './Scroller';

export class Results extends PIXI.Container {
    private holder: PIXI.Sprite;
    private scroller: Scroller;

    constructor() {
        super();

        this.visible = false;
        this.alpha = 0;

        this.addChild(GraphicsHelper.createRect(Application.WIDTH, Application.HEIGHT, 0x000000, 0.7));
        this.addChild(AssetsManager.instance.getSprite('results')).position.set(164, 70);

        let btn_exit: ImageMarginButton = new ImageMarginButton('btn_retry');
        this.addChild(btn_exit).position.set(214, 160);
        btn_exit.addListener('pointerdown', this.onExitButtonClick);

        this.scroller = new Scroller();
        this.addChild(this.scroller).position.set(240, 312);

        this.holder = new PIXI.Sprite();
    }

    private onExitButtonClick = () => {
        this.emit('complete');
    }

    public show = (data: Array<Object>) => {
        this.visible = true;
        gsap.to(this, {duration: 0.5, alpha: 1});

        this.scroller.clear();
        this.holder.removeChildren();

        let max: number = 0;

        for (let i: number = 0; i < data[0]['collection'].length; i++) {
            let item: ResultItem = new ResultItem(data[0]['collection'][i]);
            item.position.set(805, 133 * i);
            this.holder.addChild(item);
            max = Math.max(max, item.position.y + item.height);
        }

        for (let i: number = 0; i < data[1]['collection'].length; i++) {
            let item: ResultItem = new ResultItem(data[1]['collection'][i]);
            item.position.set(0, 133 * i);
            this.holder.addChild(item);
            max = Math.max(max, item.position.y + item.height);
        }

        this.holder.texture = TextureHelper.createFillTexture(new PIXI.Point(1490, max), rgba_create(0xffffff, 0.01));

        this.scroller.addElement(this.holder);
        this.scroller.mouseActive = true;
    }

    public hide = () => {
        gsap.to(this, {duration: 0.5, alpha: 0, onComplete: this.onHideComplete});
    }

    private onHideComplete = () => {
        this.visible = false;
    }
}