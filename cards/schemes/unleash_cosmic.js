import Scheme from './scheme.js';
import Twist from '../twists/twist.js';

class UnleashCosmic extends Scheme {
	constructor() {
		super();
	}

	static getName() {
		return 'Unleash the Power of the Cosmic Cube';
	}

	static getText() {
		return `Setup: 8 Twists.
Twist: Put the Twist next to this Scheme.
Twist 5-6: Each player gains a Wound.
Twist 7: Each player gains 3 Wounds.
Twist 8: Evil Wins!`
	}

	revealTwist(game) {
		console.log('todo revealTwist');
	}

	static init(game) {
		game.scheme = new UnleashCosmic();
		for( var i=0; i<8; i++ ) {
			game.villainDeck.push(new Twist());
		}
	}
}

export default UnleashCosmic;