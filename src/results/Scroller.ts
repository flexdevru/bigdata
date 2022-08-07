import gsap from 'gsap';
import * as PIXI from 'pixi.js';
import {Application} from '../Application';
import {AssetsManager} from '../managers/AssetsManager';
import {GraphicsHelper} from '../utils/Utils';

export class Scroller extends PIXI.Container {
    private currentBottom: number = 0;
    private holder: PIXI.Container;

    private track: PIXI.Sprite;
    private thumb: PIXI.Sprite;

    private minThumbPosition: number = -8;
    private maxThumbPosition: number = 0;

    private dragged: boolean = false;
    private touched: boolean = false;
    private thumbPositionDelta: number = 0;
    private pointerdown_position: number = 0;
    private old_thumb_position: number = 0;

    private scrollWidth: number = 600;
    private scrollHeight: number = 450;
    private touch: PIXI.Graphics;


    constructor(scrollWidth: number = 1490, scrollHeight: number = 680) {
        super();
        this.scrollHeight = scrollHeight;
        this.scrollWidth = scrollWidth;


        this.track = AssetsManager.instance.getSprite('track');
        this.addChild(this.track).position.set(this.scrollWidth - this.track.width + 7, -7);


        this.thumb = AssetsManager.instance.getSprite('thumb');
        this.addChild(this.thumb).position.set(this.scrollWidth - this.thumb.width - 4 + 12, -8);
        this.thumb.interactive = true;
        this.thumb.buttonMode = true;
        this.thumb.addListener('pointerdown', this.onThumbEvent);
        this.thumb.addListener('pointerup', this.onThumbEvent);
        this.thumb.addListener('pointerupoutside', this.onThumbEvent);
        this.thumb.addListener('pointermove', this.onThumbEvent);


        this.touch = GraphicsHelper.createRect(this.scrollWidth - this.thumb.width - 4, this.scrollHeight, 0xffffff, 0.01);
        this.addChild(this.touch);

        this.touch.addListener('pointerdown', this.onHolderEvent);
        this.touch.addListener('pointerup', this.onHolderEvent);
        this.touch.addListener('pointerupoutside', this.onHolderEvent);
        this.touch.addListener('pointermove', this.onHolderEvent);
        this.touch.interactive = true;

        this.addChild(this.holder = new PIXI.Container);
        let mask: PIXI.Graphics = GraphicsHelper.createRect(this.scrollWidth, this.scrollHeight, 0xff0000, 0.5);
        this.addChild(mask);
        this.holder.mask = mask;
        //this.touchActive = true;

        this.track.visible = false;
        this.thumb.visible = false;

        this.maxThumbPosition = this.scrollHeight - this.thumb.height + 8;

    }

    public set touchActive(value: boolean) {
        (Application.instance.renderer.view as HTMLCanvasElement).removeEventListener('pointerdown', this.onHolderEvent);
        (Application.instance.renderer.view as HTMLCanvasElement).removeEventListener('pointerup', this.onHolderEvent);
        //(Application.instance.renderer.view as HTMLCanvasElement).removeEventListener('pointerupoutside', this.onHolderEvent);
        (Application.instance.renderer.view as HTMLCanvasElement).removeEventListener('pointermove', this.onHolderEvent);

        if (value == true) {
            (Application.instance.renderer.view as HTMLCanvasElement).addEventListener('pointerdown', this.onHolderEvent);
            (Application.instance.renderer.view as HTMLCanvasElement).addEventListener('pointerup', this.onHolderEvent);
            //(Application.instance.renderer.view as HTMLCanvasElement).addEventListener('pointerupoutside', this.onHolderEvent);
            (Application.instance.renderer.view as HTMLCanvasElement).addEventListener('pointermove', this.onHolderEvent);


        }
    }

    public set mouseActive(value: boolean) {
        (Application.instance.renderer.view as HTMLCanvasElement).removeEventListener('wheel', this.onWheelEvent);
        if (value == true) (Application.instance.renderer.view as HTMLCanvasElement).addEventListener('wheel', this.onWheelEvent);
    }

    private onThumbEvent = (event: PIXI.InteractionEvent) => {
        switch (event.type) {
            case 'pointerdown':
                this.dragged = true;

                this.thumbPositionDelta = event.data.global.y - this.thumb.y;
                break;

            case 'pointerup':
            case 'pointerupoutside':

                this.dragged = false;
                break;

            case 'pointermove':
                if (this.dragged == false) return;

                this.thumb.y = event.data.global.y - this.thumbPositionDelta;

                if (this.thumb.y < this.minThumbPosition) this.thumb.y = this.minThumbPosition;
                if (this.thumb.y > this.maxThumbPosition) this.thumb.y = this.maxThumbPosition;

                this.update();
                break;
        }
    }

    private onWheelEvent = (event: WheelEvent) => {
        this.thumb.y = this.thumb.y + event.deltaY / 5;
        this.updateThumb();
        this.update();
    }

    private onHolderEvent = (event: any) => {
        switch (event.type) {
            case 'pointerdown':
                this.touched = true;

                this.old_thumb_position = this.thumb.y;
                this.pointerdown_position = event.data.global.y;

                break;

            case 'pointerup':
            case 'pointerupoutside':

                this.touched = false;
                break;

            case 'pointermove':
                if (this.touched == false) return;

                let k: number = (this.maxThumbPosition - this.minThumbPosition) / (this.currentBottom - this.scrollHeight);

                let delta: number = event.data.global.y - this.pointerdown_position;
                this.thumb.y = this.old_thumb_position - delta * k;


                this.updateThumb();
                this.update();
                break;
        }
    }

    public addElement = (element: PIXI.Sprite): PIXI.Sprite => {
        let elementHeight: number = element.height;

        this.holder.addChild(element);

        this.currentBottom = elementHeight;

        if (this.currentBottom > this.scrollHeight) {
            this.track.visible = true;
            this.thumb.visible = true;
        }
        else {
            this.track.visible = false;
            this.thumb.visible = false;
        }

        this.scrollUp();

        return element;
    }

    public clear = () => {
        this.holder.removeChildren();

        this.currentBottom = 0;

        if (this.currentBottom > this.scrollHeight) {
            this.track.visible = true;
            this.thumb.visible = true;
        }
        else {
            this.track.visible = false;
            this.thumb.visible = false;
        }

    }

    public scrollDown = () => {
        if (this.currentBottom + this.holder.y > this.scrollHeight) {
            let newY: number = this.scrollHeight - this.currentBottom;
            gsap.to(this.holder, {duration: 0.25, y: newY});
            gsap.to(this.thumb, {duration: 0.25, y: this.maxThumbPosition});
        }

        this.update();
    }

    public scrollUp = () => {
        this.thumb.y = this.minThumbPosition;
        this.update();
    }

    private update = () => {
        let percent: number = (this.thumb.y - this.minThumbPosition) / (this.maxThumbPosition - this.minThumbPosition);

        let newY: number = (this.scrollHeight - this.currentBottom) * percent;
        gsap.to(this.holder, {duration: 0.25, y: newY});
    }

    private updateThumb = () => {
        if (this.thumb.visible == false) {
            this.thumb.y = this.minThumbPosition;
            return;
        }

        if (this.thumb.y < this.minThumbPosition) this.thumb.y = this.minThumbPosition;
        if (this.thumb.y > this.maxThumbPosition) this.thumb.y = this.maxThumbPosition;
    }
}