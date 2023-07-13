import Card from '../card.js';

class Mastermind extends Card {
	constructor() {
		super();
	}

	static getName() {
		return 'Base Mastermind';
	}

	static getText() {
		return 'n/a';
	}

	static getType() {
		return 'Mastermind';
	}

	getVp() {
		return 0;
	}

	getAttack(game) {
		return 0;
	}

	getTactics(game) {
		return [];
	}

	static init(game) {
	}
}

export default Mastermind;