import Card from '../card.js';

class Hero extends Card {
	constructor() {
		super();
	}

	static getType() {
		return 'Hero';
	}

	static getCost() {
		return 0;
	}
	static getTeams() {
		return [];
	}
	static getClasses() {
		return [];
	}

	getCost() {
		return this.constructor.getCost();
	}

	getTeams() {
		return this.constructor.getTeams();
	}

	getClasses() {
		return this.constructor.getClasses();
	}

	play(game) {
		game.currentPlayer.playedCards.push(this);
	}

	getSlashes(game) {
		return 0;
	}

	getMoney(game) {
		return 0;
	}
}

export default Hero;