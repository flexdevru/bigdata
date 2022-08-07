import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import {Application} from '../Application';
import {AssetsManager} from '../managers/AssetsManager';
import {Rectangle} from '../utils/Utils';
import {ItemsFabric} from './ItemsFabric';
import {TrackItem, TrackItemFabric} from './TrackItemFabric';
import {Game} from './Game';

export class Item extends PIXI.Sprite {
    public static COLUMN_COUNT: number = 3;
    public static LAST_COLUMN: number = -1;
    public static TYPES_COUNT: number = 3;
    public static LAST_TYPE: number = -1;

    public static TIME_TO_MOVE: number = 7;

    private data!: Object;
    private text: PIXI.Text;

    private column: number = -1;
    private type: number = -1;

    private normal_texture!: PIXI.Texture;
    private over_texture!: PIXI.Texture;

    private dragged: boolean = false;
    private delta: PIXI.Point;

    private track_timer: number = 0;

    constructor() {
        super();

        this.text = new PIXI.Text('', {fontFamily: 'Medium', fontSize: 35, fill: 0xffffff, wordWrap: true, wordWrapWidth: this.width * 0.7, align: 'center'});
        this.addChild(this.text);
        this.text.anchor.set(0.5, 0.5)

        this.interactive = true;

        this.interactive = true;
        this.addListener('pointermove', this.onPointerEvent);
        this.addListener('pointerup', this.onPointerEvent);
        this.addListener('pointerupoutside', this.onPointerEvent);
        this.addListener('pointerdown', this.onPointerEvent);

        this.addListener('pointerover', this.onPointerEvent);
        this.addListener('pointerout', this.onPointerEvent);


        this.delta = new PIXI.Point();

    }

    public set_data = (data: Object) => {
        this.data = data;
        this.text.text = data['text'].toUpperCase();
    }

    public restore = () => {
        this.generate_state();

        this.normal_texture = AssetsManager.instance.getTexture('item' + this.type.toString());
        this.over_texture = AssetsManager.instance.getTexture('item' + this.type.toString() + '_over');
        this.texture = this.normal_texture;

        this.generate_position();

        this.track_timer = setInterval(this.start_track, 25);
        this.text.position.set(this.width / 2, this.height / 2);
        this.text.style.wordWrapWidth = 0.7 * this.width;

        let font_size: number = 35;
        this.text.style.fontSize = font_size;

        while (this.text.width > 0.7 * this.width) {
            font_size = font_size - 1;
            this.text.style.fontSize = font_size;
        }

        this.move();
    }

    private generate_state = () => {
        this.column = Math.floor(Math.random() * Item.COLUMN_COUNT) + 1;
        while (this.column == Item.LAST_COLUMN) {
            this.column = Math.floor(Math.random() * Item.COLUMN_COUNT) + 1;
        }

        this.type = Math.floor(Math.random() * Item.TYPES_COUNT) + 1;
        while (this.type == Item.LAST_TYPE) {
            this.type = Math.floor(Math.random() * Item.TYPES_COUNT) + 1;
        }

        Item.LAST_COLUMN = this.column;
        Item.LAST_TYPE = this.type;
    }

    private generate_position = () => {
        this.position.y = -this.height - 10;
        this.position.x = this.column * Application.WIDTH / 4 - this.width / 2;
    }

    private move = () => {
        let last_distance: number = Application.HEIGHT - this.position.y;
        let time: number = Item.TIME_TO_MOVE * (last_distance / Application.HEIGHT);
        gsap.to(this.position, {duration: time, y: Application.HEIGHT + 400, ease: 'none', onComplete: this.onMoveComplete});
    }

    private stop = () => {
        gsap.killTweensOf(this.position);
    }

    private onPointerEvent = (event: PIXI.InteractionEvent) => {

        switch (event.type) {
            case 'pointerdown':

                this.dragged = true;
                this.delta.copyFrom(new PIXI.Point(event.data.global.x - this.x, event.data.global.y - this.y));
                this.parent.setChildIndex(this, this.parent.children.length - 1);
                this.emit('touch', this);
                this.stop();
                break;

            case 'pointerup':
            case 'pointerupoutside':
                this.dragged = false;
                this.emit('drop', this);
                this.emit('out', this);
                this.move();
                break;

            case 'pointermove':
                if (this.dragged == false) return;
                this.position.x = Math.round(event.data.global.x - this.delta.x);
                this.position.y = Math.round(event.data.global.y - this.delta.y);

                if (this.position.x < 0) this.position.x = 0;
                if (this.position.x > Application.WIDTH - this.width) this.position.x = Application.WIDTH - this.width;

                this.parent.setChildIndex(this, this.parent.children.length - 1);
                this.emit('drag', this);

                break;

            case 'pointerover':
                this.texture = this.over_texture

                this.emit('over', this);
                break;

            case 'pointerout':
                this.texture = this.normal_texture;
                this.emit('out', this);
                break;

        }
    }

    private onMoveComplete = () => {
        this.reset();
        ItemsFabric.instance.storeItem(this);
    }

    public start_track = () => {
        for (let i: number = 0; i < 50; i++);
        {
            let track_item: TrackItem = TrackItemFabric.instance.getItem();
            track_item.restore();
            track_item.position.set(this.position.x + Math.floor(Math.random() * this.width), this.position.y + this.height / 4 + Math.floor(Math.random() * 40 - 20));
            Game.TRACK_LAYER.addChild(track_item);
        }
    }

    public right = () => {
        this.reset();
    }

    public wrong = () => {
        this.reset();
    }

    public get rect(): Rectangle {
        return new Rectangle(this.position.x, this.position.y, this.width, this.height);
    }

    public get data_type(): string {
        return this.data['type'];
    }

    public get data_text(): string {
        return this.data['text'];
    }

    public reset = () => {
        gsap.killTweensOf(this.position);
        clearInterval(this.track_timer);
        if (this.parent != null) this.parent.removeChild(this);

        this.removeAllListeners('drag');
        this.removeAllListeners('drop');
        this.removeAllListeners('over');
        this.removeAllListeners('out');
        this.removeAllListeners('touch');

    }
}
