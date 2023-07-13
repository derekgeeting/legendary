import Mastermind from './mastermind.js';
/*
Red Skull

Endless Resources
Fight: You get +4 Recruit.

HYDRA Conspiracy
Fight: Draw two cards. Then draw another card for each HYDRA Villain in your Victory Pile.

Negablast Grenades
Fight: You get +3 Attack.

Ruthless Dictator
Fight: Look at the top three cards of your deck. KO one, discard one and put one back on top of your deck.

*/

class RedSkull extends Mastermind {
	constructor() {
		super();
	}

	static getName() {
		return 'Red Skull';
	}

	static getText() {
		return `Always Leads: HYDRA
Master Strike: Each player KOs a Hero from their hand.
Attack: 7
VP: 5
`;
	}

	revealMasterStrike() {
		console.log('todo revealMasterStrike');
	}

	getVp() {
		return 5;
	}

	getAttack() {
		return 7;
	}

	static init(game) {
		const mm = new RedSkull();
		game.mastermind = mm;
	}
}

export default RedSkull;