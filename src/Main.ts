import * as PIXI from 'pixi.js';
import {Game} from './game/Game';
import {AssetsManager} from './managers/AssetsManager';
import {SoundManager} from './managers/SoundManager';
import {StorylineManager} from './managers/StorylineManager';
import {Reflection} from './reflection/Reflection';
import {ReflectionRight} from './reflection/ReflectionRight';
import {ReflectionWrong} from './reflection/ReflectionWrong';
import {Results} from './results/Results';
import {Tutorial} from './tutorial/Tutorial';


export class Main extends PIXI.Container {
	public static DEBUG: boolean = true;
	public static instance: Main;

	private tutorial!: Tutorial;

	private game!: Game;
	private reflection_wrong!: ReflectionWrong;
	private reflection_right!: ReflectionRight;
	private currect_reflection!: Reflection;

	private results!: Results;

	constructor() {
		super();
		this.addChild(AssetsManager.instance).start(this.onAssetsLoadComplete);
		SoundManager.instance.init();
	}

	private onAssetsLoadComplete = () => {
		Main.instance = this;
		this.removeChild(AssetsManager.instance);
		this.createChildren();
	}

	private createChildren = () => {
		this.tutorial = new Tutorial();
		this.addChild(this.tutorial);
		this.tutorial.addListener('complete', this.onTutorialComplete);
		this.tutorial.show();


		this.game = new Game();
		this.addChild(this.game);
		this.game.addListener('end_round', this.onEndRoundComplete);

		this.reflection_wrong = new ReflectionWrong();
		this.addChild(this.reflection_wrong);
		this.reflection_wrong.addListener('retry', this.onRetryGame);
		this.reflection_wrong.addListener('results', this.onResultsGame);

		this.reflection_right = new ReflectionRight();
		this.addChild(this.reflection_right);
		this.reflection_right.addListener('retry', this.onRetryGame);
		this.reflection_right.addListener('results', this.onResultsGame);
		this.reflection_right.addListener('next', this.onNextGame);

		this.results = new Results();
		this.addChild(this.results);
		this.results.addListener('complete', this.onResultsComplete);
	}

	private onTutorialComplete = () => {
		this.tutorial.hide();
		this.game.show();
		this.game.start_round();

	}

	private onEndRoundComplete = (score: number) => {
		this.game.blur();

		if (score < 0.8) {
			this.reflection_wrong.show(score);
			this.currect_reflection = this.reflection_wrong;
		}
		else {
			this.reflection_right.show(score);
			this.currect_reflection = this.reflection_right;
		}
	}

	private onRetryGame = () => {
		this.currect_reflection.hide();
		this.game.unblur();
		this.game.retry();
	}

	private onNextGame = () => {
		this.currect_reflection.hide();

		let res: boolean = this.game.start_round();

		if (res == true) {
			this.game.unblur();
		}
		else {
			StorylineManager.instance.goNext();
		}
	}

	private onResultsGame = () => {
		this.currect_reflection.hide();
		this.results.show(this.game.collections);
	}

	private onResultsComplete = () => {
		this.currect_reflection.show();
		this.results.hide();
	}
}