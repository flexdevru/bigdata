import * as PIXI from 'pixi.js';
import {AssetsManager} from '../managers/AssetsManager';

export class ResultItem extends PIXI.Sprite {
    constructor(data: Object) {
        super();

        this.texture = AssetsManager.instance.getTexture((data['correct'] == true) ? 'item_right' : 'item_wrong');
        let text: PIXI.Text = new PIXI.Text(data['text'].toUpperCase(), {fontFamily: 'Regular', fill: (data['correct'] == true) ? 0xccecfe : 0xfecccc, fontSize: 32.64, wordWrap: true, wordWrapWidth: this.width, align: 'center'});
        this.addChild(text).position.set(this.width / 2, this.height / 2);
        text.anchor.set(0.5, 0.5);
    }
}