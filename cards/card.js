class Card {
	constructor() {
	}

	static getName() {}
	static getText() {}
	static getType() {}

	getName() {
		return this.constructor.getName();
	}
	getText() {
		return this.constructor.getText();
	}
	getType() {
		return this.constructor.getType();
	}
}

export default Card;