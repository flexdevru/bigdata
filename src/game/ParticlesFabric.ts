import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import {AssetsManager} from '../managers/AssetsManager';
import {Application} from '../Application';

export class ParticlesFabric {
    private static _instance: ParticlesFabric | null = null;

    private items: Array<Particle>;

    public static get instance(): ParticlesFabric {
        if (ParticlesFabric._instance == null) ParticlesFabric._instance = new ParticlesFabric();
        return ParticlesFabric._instance;
    }

    constructor() {
        this.items = new Array<Particle>();
    }

    public getItem = (): Particle => {
        if (this.items.length == 0) return new Particle();
        return this.items.shift() as Particle;
    }

    public storeItem = (item: Particle) => {
        item.reset();
        this.items.push(item);
    }

    public get count(): number {
        return this.items.length;
    }
}

export class Particle extends PIXI.Sprite {
    constructor() {
        super();
    }

    public restore = () => {
        this.texture = AssetsManager.instance.getTexture('p' + (Math.floor(Math.random() * 15) + 1).toString());
        this.position.set(Math.random() * Application.WIDTH, -100);
        this.move();
    }

    private move = () => {
        gsap.to(this.position, {duration: Math.random() * 3 + 2, y: Application.HEIGHT, ease: 'none', onComplete: this.onMoveComplete});
    }

    private onMoveComplete = () => {
        gsap.killTweensOf(this.position);
        this.parent.removeChild(this);
        ParticlesFabric.instance.storeItem(this);
    }

    public reset = () => {
        //console.log('');
    }
}