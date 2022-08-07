import gsap from 'gsap';
import * as PIXI from 'pixi.js';
import {Application} from '../Application';
import {AssetsManager} from '../managers/AssetsManager';
import {Rectangle} from '../utils/Utils';
import {Item} from './Item';
import {Video} from './Video';
import {VideoLoop} from './VideoLoop';

export class Zone extends PIXI.Container {
    public type: string;
    public collection: Array<Object>;

    private back: PIXI.Sprite;
    private over: PIXI.Sprite;

    private reflection: PIXI.Sprite;

    private video_normal!: VideoLoop;
    private video_wrong!: Video;

    constructor(type: string) {
        super();

        this.alpha = 0;

        this.type = type;

        this.back = AssetsManager.instance.getSprite('zone_back_' + this.type);
        this.addChild(this.back);

        this.video_normal = new VideoLoop();
        this.addChild(this.video_normal);
        this.video_normal.show(this.type + '_normal.mp4');

        this.video_wrong = new Video();
        this.addChild(this.video_wrong);
        this.video_wrong.show(this.type + '_wrong.mp4');

        if (this.type == 'bigdata') this.position.set(Application.WIDTH - 808, Application.HEIGHT - 606);
        else this.position.set(-24, Application.HEIGHT - 626);

        this.over = AssetsManager.instance.getSprite('zone_' + this.type);
        this.addChild(this.over);

        if (this.type == 'bigdata') this.over.position.set(0, 0);
        else this.over.position.set(20, 0);

        this.over.alpha = 0;


        this.reflection = new PIXI.Sprite();
        this.addChild(this.reflection);
        this.reflection.alpha = 0;
        if (this.type == 'bigdata') this.reflection.position.set(-90, -100);
        else this.reflection.position.set(30, -88);

        this.collection = new Array<Object>();
    }

    public ready = () => {

        this.video_normal.play();
    }

    private test = (rect: Rectangle): boolean => {
        let place: Rectangle = new Rectangle();
        if (this.type == 'bigdata') {
            place.x = 185 + this.position.x;
            place.y = 264 + this.position.y;
            place.width = 480;
            place.height = 370;
        }
        else {
            place.x = 118 + this.position.x;;
            place.y = 264 + this.position.y
            place.width = 480;
            place.height = 370;
        }
        return place.intersects(rect);
    }

    public dropItem = (item: Item) => {
        if (this.test(item.rect) == true) {
            if (this.type == item.data_type) {
                item.right();
                this.collection.push({text: item.data_text, correct: true});
                this.emit('collect', true);
                this.hide_hover();

                this.show_reflection('right');

            }
            else {
                item.wrong();
                this.collection.push({text: item.data_text, correct: false});
                this.emit('collect', false);
                this.show_wrong_video();
                this.hide_hover();

                this.show_reflection('wrong');
            }

            this.reflection.visible = true;
        }
    }

    private show_wrong_video = () => {
        this.video_wrong.play();
    }

    public show_hover = () => {
        gsap.to(this.over, {duration: 0.25, alpha: 1});
    }

    public hide_hover = () => {
        gsap.to(this.over, {duration: 0.25, alpha: 0});
    }

    public show_reflection = (type: string) => {
        this.reflection.texture = AssetsManager.instance.getTexture('zone_' + this.type + '_' + type);

        gsap.to(this.reflection, {duration: 0.25, alpha: 1});
        setTimeout(this.hide_reflection, 250);
    }

    public hide_reflection = () => {
        gsap.to(this.reflection, {duration: 0.25, alpha: 0});
    }

    public reset = () => {
        this.collection = new Array<Object>();
        this.hide_hover();
    }

    public show = () => {
        gsap.to(this, {duration: 0.25, alpha: 1});
        this.ready();
    }
}
