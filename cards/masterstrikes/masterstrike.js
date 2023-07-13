import Card from '../card.js';

class MasterStrike extends Card {
	constructor() {
		super();
	}

	static getName() {
		return 'Master Strike';
	}

	static getType() {
		return 'MasterStrike';
	}

	static getText() {
		return '';
	}
}

export default MasterStrike;