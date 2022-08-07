import * as PIXI from 'pixi.js';
import {Particle, ParticlesFabric} from './ParticlesFabric';

export class ParticlesLayer extends PIXI.Container {
    constructor() {
        super();
        this.pull_particle();
    }

    private pull_particle = () => {
        let item: Particle = ParticlesFabric.instance.getItem();
        item.restore();
        this.addChild(item);
        setTimeout(this.pull_particle, 1000);
    }
}