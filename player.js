import _ from 'lodash';

class Player {
	constructor(name) {
		this.name = name;
		this.deck = [];
		this.discard = [];
		this.hand = [];
		this.playedCards = [];
		this.victoryCards = [];
		this.money = 0;
		this.slashes = 0;
	}

	drawHand(n = 6) {
		for( let i=0; i<n; i++ ) {
			if (this.deck.length > 0) {
				this.hand.push(this.deck.shift());
			} else if (this.discard.length > 0) {
				this.deck = _.shuffle(this.discard);
				this.discard = [];
				this.hand.push(this.deck.shift());
			}
		}
	}

	play(n, game) {
		const card = this.hand[n-1];
		_.pullAt(this.hand, n-1);
		card.play(game);
	}
}

export default Player;