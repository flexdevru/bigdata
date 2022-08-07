import gsap from 'gsap';
import * as PIXI from 'pixi.js';

export class TrackItemFabric {
    private static _instance: TrackItemFabric | null = null;

    private items: Array<TrackItem>;

    public on_screen: number = 0;

    public static get instance(): TrackItemFabric {
        if (TrackItemFabric._instance == null) TrackItemFabric._instance = new TrackItemFabric();
        return TrackItemFabric._instance;
    }

    constructor() {
        this.items = new Array<TrackItem>();
    }

    public getItem = (): TrackItem => {
        this.on_screen++;
        if (this.items.length == 0) return new TrackItem();
        return this.items.shift() as TrackItem;
    }

    public storeItem = (item: TrackItem) => {
        this.on_screen--;
        item.reset();
        this.items.push(item);
    }

    public get count(): number {
        return this.items.length;
    }
}

export class TrackItem extends PIXI.Text {
    private bzzz_timer: number = 0;

    constructor() {
        super('', {fontFamily: 'Track', fontSize: 28, fill: 0xffffff});
        let digit: number = Math.random() < 0.5 ? 0 : 1;
        this.text = digit.toString();
    }

    private fade = () => {
        gsap.to(this, {duration: 1.5, alpha: 0, ease: 'none', onComplete: this.onFadeComplete});
    }

    private onFadeComplete = () => {
        this.visible = false;
        if (this.parent != null) this.parent.removeChild(this);
        TrackItemFabric.instance.storeItem(this);
    }

    private bzzz = () => {
        let dir_x: number = Math.random() < 0.5 ? -1 : 1;
        let dir_y: number = Math.random() < 0.5 ? -1 : 1;

        this.position.x = this.position.x + dir_x;
        this.position.y = this.position.y + dir_y;
    }

    public restore = () => {
        this.visible = true;
        this.alpha = 1;
        this.bzzz_timer = setInterval(this.bzzz, 100);
        this.fade();
    }

    public reset = () => {
        clearInterval(this.bzzz_timer);
    }
}