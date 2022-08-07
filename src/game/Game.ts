import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import {Timer} from './Timer';
import {Counter} from './Counter';
import {Countdown} from './Countdown';
import {Zone} from './Zone';
import {Item} from './Item';
import {AssetsManager} from '../managers/AssetsManager';
import {ParticlesLayer} from './ParticlesLayer';
import {Application} from '../Application';
import {ItemsFabric} from './ItemsFabric';

export class Game extends PIXI.Container {
    public static ROUND: number = 0;
    public static TRACK_LAYER: PIXI.Container;
    private data: Object;


    private items!: Array<Object>;
    //private correct_count: number = 0;

    private items_layer: PIXI.Container;

    private item_counter: number = -1;

    //private track_counter: number = 0;
    //private track_label!: PIXI.Text;


    private timer: Timer;
    private counter: Counter;
    private countdown: Countdown;

    private zones: Array<Zone>;

    private rounds: number = 3;
    private current_round: number = 0;

    private hand_layer: PIXI.Container;
    private hand: PIXI.Sprite;

    private current_item: Item | null = null;

    constructor() {
        super();

        this.visible = false;
        this.alpha = 0;

        this.data = AssetsManager.instance.getObject('data');
        this.addChild(AssetsManager.instance.getSprite('background'));
        this.rounds = this.data['rounds'];


        this.zones = new Array<Zone>();
        let zone: Zone = new Zone('bigdata');
        zone.addListener('collect', this.onZoneCollect);
        this.addChild(zone);
        this.zones.push(zone);

        zone = new Zone('traditional');
        zone.addListener('collect', this.onZoneCollect);
        this.addChild(zone);
        this.zones.push(zone);

        this.addChild(new ParticlesLayer());


        this.addChild(Game.TRACK_LAYER = new PIXI.Container());
        this.addChild(this.items_layer = new PIXI.Container());

        this.timer = new Timer();
        this.addChild(this.timer);
        this.timer.addListener('complete', this.onTimerComplete);


        this.counter = new Counter();
        this.addChild(this.counter);

        this.hand_layer = new PIXI.Container();
        this.hand_layer.interactive = false;
        this.hand_layer.interactiveChildren = false;
        this.addChild(this.hand_layer);

        this.hand = AssetsManager.instance.getSprite('hand');
        this.hand_layer.addChild(this.hand);
        this.hand.pivot.set(100, 0);
        this.hand.position.set(Application.WIDTH / 2, Application.HEIGHT / 2);

        this.addListener('pointermove', this.onPointerMove);

        this.hide_cursor();

        this.countdown = new Countdown();
        this.addChild(this.countdown);
        this.countdown.addListener('complete', this.onCountdownComplete);

    }

    public show = () => {
        this.visible = true;
        gsap.to(this, {duration: 0.5, alpha: 1});

        for (let i: number = 0; i < this.zones.length; i++) {
            setTimeout(this.zones[i].show, 500);
        }
    }

    private pull_item = () => {
        this.item_counter++;

        if (this.item_counter == this.items.length) {
            return;
        }

        let item_data: Object = this.items[this.item_counter];

        let item: Item = ItemsFabric.instance.getItem();
        item.restore();
        item.addListener('drag', this.onItemDrag);
        item.addListener('drop', this.onItemDrop);
        item.addListener('over', this.onItemOver);
        item.addListener('out', this.onItemOut);
        item.addListener('touch', this.onItemTouch);
        item.addListener('pointerover', this.onItemPointerOver);

        item.set_data(item_data);



        this.items_layer.addChildAt(item, 0);

        let delay: number = 0;
        if (this.current_round == 1) {
            delay = 4500;
            Item.TIME_TO_MOVE = 10;
        }
        else if (this.current_round == 2) {
            delay = 3500;
            Item.TIME_TO_MOVE = 8.1;
        }
        else if (this.current_round == 3) {
            delay = 3000;
            Item.TIME_TO_MOVE = 7.5;
        }

        setTimeout(this.pull_item, delay);
    }

    private onItemDrag = (item: Item) => {
        /*
        for (let i: number = 0; i < this.zones.length; i++)
        {
            this.zones[i].show();
        }
        */
    }

    private onItemTouch = (item: Item) => {
        for (let i: number = 0; i < this.zones.length; i++) {
            this.zones[i].show_hover();
        }
    }

    private onItemDrop = (item: Item) => {
        for (let i: number = 0; i < this.zones.length; i++) {
            this.zones[i].dropItem(item);
            this.zones[i].hide_hover();
        }

        this.hide_cursor();
    }

    private onItemOver = (item: Item) => {
        this.current_item = item;
        this.show_cursor();

    }

    private onItemOut = (item: Item) => {
        if (this.current_item != item) return;
        this.hide_cursor();
    }

    private onZoneCollect = (result: boolean) => {
        if (result == true) this.counter.tick();
    }

    private onTimerComplete = () => {
        this.end_round();
    }

    private randomize = (val1: Object, val2: Object): number => {

        if (Math.random() > 0.5) return 1;
        return -1;
    }

    public start_round = (retry: boolean = false): boolean => {

        for (let i: number = 0; i < this.zones.length; i++)this.zones[i].reset();

        if (retry == false) this.current_round++;

        Game.ROUND = this.current_round;

        if (this.current_round > this.rounds) {
            console.log('game_over');
            return false;
        }

        this.items = this.data['round' + this.current_round.toString()];

        this.items.sort(this.randomize);
        this.items.sort(this.randomize);
        this.items.sort(this.randomize);


        this.counter.start(this.items.length);

        this.item_counter = -1;
        this.countdown.start();
        //this.pull_item();

        console.log('start_round');
        this.hide_cursor();
        return true;
    }

    private onCountdownComplete = () => {
        this.pull_item();
        this.timer.start();
    }

    private end_round = () => {
        this.timer.stop();
        this.hide_cursor();
        console.log('end_round');
        this.emit('end_round', this.counter.score);
    }

    public retry = () => {
        this.start_round(true);
    }

    public blur = () => {
        this.filters = [new PIXI.filters.BlurFilter(8)];
        this.hide_cursor();
    }

    public unblur = () => {
        this.filters = [];
        this.show_cursor();
    }

    public get collections(): Array<Object> {
        let res: Array<Object> = new Array<Object>();

        for (let i: number = 0; i < this.zones.length; i++) {
            res.push({type: this.zones[i].type, collection: this.zones[i].collection});
        }

        return res;
    }

    private onPointerMove = (event: any) => {
        this.hand.position.x = event.data.global.x;
        this.hand.position.y = event.data.global.y;
    }

    private onItemPointerOver = (event: any) => {
        this.hand.position.x = event.data.global.x;
        this.hand.position.y = event.data.global.y;
        this.cursor = 'none';
        this.interactive = true;
    }

    public show_cursor = () => {
        this.interactive = true;
        //this.buttonMode = false;
        //Application.instance.renderer.plugins.interaction.cursorStyles.default = 'none';
        //Application.instance.renderer.plugins.interaction.setCursorMode('none');
        this.hand.visible = true;
        this.cursor = 'none';
    }

    public hide_cursor = () => {
        this.interactive = false;
        //this.buttonMode = false;
        //Application.instance.renderer.plugins.interaction.cursorStyles.default = 'pointer';
        //Application.instance.renderer.plugins.interaction.setCursorMode('pointer');
        //this.defaultCursor = 'pointer';
        this.hand.visible = false;
        this.cursor = 'pointer';
    }
}