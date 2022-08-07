import * as PIXI from 'pixi.js';
import {AssetsManager} from '../managers/AssetsManager';

export class Video extends PIXI.Sprite {
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
                this.emit('ready');
                break;

            case 'seeked':
                if (this.video != null) this.video.play();
                break;

            case 'play':
                this.visible = true;
                break;

            case 'ended':
                this.visible = false;
                if (this.video != null) this.video.pause();
                break;
        }
    }

    public show = (file_name: string) => {
        this.videoResource = new PIXI.VideoResource(AssetsManager.VIDEOS + file_name, {autoLoad: true, autoPlay: false, });
        this.video = this.videoResource.source;
        this.content.texture = PIXI.Texture.from(this.videoResource.source);

        this.video.addEventListener('canplaythrough', this.onVideoEvent, false);
        this.video.addEventListener('seeked', this.onVideoEvent, false);
        this.video.addEventListener('ended', this.onVideoEvent, false);
        this.video.addEventListener('play', this.onVideoEvent, false);
    }

    public play = () => {
        if (this.video != null) {
            if (this.video.currentTime > 0) this.video.currentTime = 0;
            else this.video.play();
        }
    }
}