import Hero from './hero.js';

class ShieldOfficer extends Hero {
	constructor() {
		super();
	}

	static getName() {
		return 'Shield Officer';
	}

	static getText() {
		return '$2';
	}

	static getCost() {
		return 3;
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
		return 2;
	}

	play(game) {
		super.play(game);
		game.currentPlayer.money += this.getMoney(game);
	}
}

export default ShieldOfficer;