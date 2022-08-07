import * as PIXI from 'pixi.js';
import {AssetsManager} from '../managers/AssetsManager';

export class VideoLoop extends PIXI.Sprite {
    private content: PIXI.Sprite;
    private video: HTMLVideoElement | null = null;
    private videoResource!: PIXI.VideoResource;

    constructor() {
        super();

        this.content = new PIXI.Sprite();
        this.addChild(this.content);
        this.visible = false;
    }

    private onVideoEvent = (event: Event) => {
        switch (event.type) {
            case 'canplaythrough':

                break;
        }
    }

    public show = (file_name: string) => {
        this.videoResource = new PIXI.VideoResource(AssetsManager.VIDEOS + file_name, {autoLoad: true, autoPlay: false, });
        this.video = this.videoResource.source;
        this.content.texture = PIXI.Texture.from(this.videoResource.source);
        this.video.addEventListener('canplaythrough', this.onVideoEvent, false);
        this.video.loop = true;
    }

    public play = () => {
        this.visible = true;
        if (this.video != null) this.video.play();

    }
}