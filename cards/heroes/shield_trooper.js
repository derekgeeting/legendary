import Hero from './hero.js';

class ShieldTrooper extends Hero {
	constructor() {
		super();
	}

	static getName() {
		return 'Shield Trooper';
	}

	static getText() {
		return '1 //';
	}

	static getCost() {
		return 0;
	}

	static getTeams() {
		return ['Shield'];
	}

	static getClasses() {
		return [];
	}

	getSlashes(game) {
		return 1;
	}

	getMoney(game) {
		return 0;
	}

	play(game) {
		super.play(game);
		game.currentPlayer.slashes += this.getSlashes(game);
	}
}

export default ShieldTrooper;