import Card from '../card.js';

class Scheme extends Card {
	constructor() {
		super();
	}

	static getName() {
		return 'Base Scheme';
	}

	static getText() {
		return 'n/a';
	}

	static getType() {
		return 'Scheme';
	}

	static init(game) {
	}
}

export default Scheme;