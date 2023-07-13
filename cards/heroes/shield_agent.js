import Hero from './hero.js';

class ShieldAgent extends Hero {
	constructor() {
		super();
	}

	static getName() {
		return 'Shield Agent';
	}

	static getText() {
		return '$1';
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
		return 0;
	}

	getMoney(game) {
		return 1;
	}

	play(game) {
		super.play(game);
		game.currentPlayer.money += this.getMoney(game);
	}
}

export default ShieldAgent;