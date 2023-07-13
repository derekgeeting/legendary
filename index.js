import vorpal from 'vorpal';
import Bystander from './cards/bystanders/bystander.js';
import Game from './game.js';
import masterminds from './cards/masterminds/index.js';
import schemes from './cards/schemes/index.js';

const cd = vorpal();

let game = new Game();
game.settings.scheme = schemes[0];
game.settings.mastermind = masterminds[0];

function updatePrompt() {
	if( game && game.currentPlayer) {
		cd.delimiter(`${game.currentPlayer.name}  //:${game.currentPlayer.slashes}  $:${game.currentPlayer.money} > `);
	} else {
		cd.delimiter('> ');
	}
}

function getViewListFn(list) {
	return function(args, cb) {
		if( args.n ) {
			cd.log(list[args.n-1].getName());
			cd.log(list[args.n-1].getText());
		} else {
			for (var i=0; i<list.length; i++) {
				cd.log(`${i+1}.  ${list[i].getName()}`);
			}
		}
		cb();
	}
}

cd.command('show [words...]')
  .action(function (args, cb) {
    let str = args.words.join(' ');
    this.log(str);
    cb();
  });

cd.command('init')
  .action(function(args, cb) {
  	game = new Game();
  	this.log('New game initialized');
  	cb();
  });

cd.command('settings')
	.action(function(args, cb) {
		if (!game) {
			this.log('Game not initialized');
		} else {
			this.log('Players: '+game.settings.playerNames.join(', '));
			this.log('Mastermind: ' + (game.settings.mastermind === null ? 'not set' : game.settings.mastermind.getName() ) );
			this.log('Scheme: ' + (game.settings.scheme === null ? 'not set' : game.settings.scheme.getName()) );
			this.log(`\nReady: ${game.isReady()}`);
		}
		cb();
	});

cd.command('masterminds [n]', 'list masterminds')
	.alias('mm')
	.action(getViewListFn(masterminds));

cd.command('set mastermind <mastermind>', 'Set the mastermind for this game')
	.alias('set mm')
	.action(function(args, cb) {
		const n = parseInt(args.mastermind);
		if (isNaN(n)) {
			this.log('todo: search mastermind by text');
		} else {
			game.settings.mastermind = masterminds[n-1];
			this.log(`Set mastermind to ${game.settings.mastermind.getName()}`);
		}
		cb();
	});

cd.command('schemes [n]', 'list schemes')
	.action(getViewListFn(schemes));

cd.command('scheme', 'show current scheme')
	.action(function(args, cb) {
		if (game.settings.scheme === null) {
			this.log('Scheme not set');
		} else {
			this.log(game.settings.scheme.getName());
			this.log(game.settings.scheme.getText());
		}
		cb();
	});

cd.command('set scheme <scheme>', 'Set the scheme for this game')
	.action(function(args, cb) {
		const n = parseInt(args.scheme);
		if (isNaN(n)) {
			this.log('todo: search scheme by text');
		} else {
			game.settings.scheme = schemes[n-1];
			this.log(`Set scheme to ${game.settings.scheme.getName()}`);
		}
		cb();
	});

cd.command('villain deck [n]', 'Show contents of villain deck')
	.alias('vd')
	.action(function(args, cb) {
		if( args.n ) {
			this.log('Name: '+game.villainDeck[args.n-1].getName());
			this.log('Type: '+game.villainDeck[args.n-1].getType());
			this.log(game.villainDeck[args.n-1].getText());
		} else {
			for (var i=0; i<game.villainDeck.length; i++) {
				// this.log(`${i+1}.  ${game.villainDeck[i].getName()} - ${game.villainDeck[i].getType()}`);
				this.log(`${i+1}.  ${game.villainDeck[i].getName()} - ${game.villainDeck[i].getType()}`);
			}
		}
		cb();
	})

cd.command('game', 'Details of the game')
	.action(function(args, cb) {
		this.log('Current Player: '+game.currentPlayer.name);
		cb();
	});

cd.command('deck [n]', 'Show contents of current player\'s deck')
	.alias('pd')
	.action(function(args, cb) {
		if( args.n ) {
			this.log('Name: '+game.currentPlayer.deck[args.n-1].getName());
			this.log('Type: '+game.currentPlayer.deck[args.n-1].getType());
			this.log(game.currentPlayer.deck[args.n-1].getText());
		} else {
			for (var i=0; i<game.currentPlayer.deck.length; i++) {
				this.log(`${i+1}.  ${game.currentPlayer.deck[i].getName()} - ${game.currentPlayer.deck[i].getType()}`);
			}
		}
		cb();
	});

cd.command('hand [n]', 'Show contents of current player\'s hand')
	.alias('ph')
	.action(function(args, cb) {
		if( args.n ) {
			this.log('Name: '+game.currentPlayer.hand[args.n-1].getName());
			this.log('Type: '+game.currentPlayer.hand[args.n-1].getType());
			this.log(game.currentPlayer.hand[args.n-1].getText());
		} else {
			for (var i=0; i<game.currentPlayer.hand.length; i++) {
				this.log(`${i+1}.  ${game.currentPlayer.hand[i].getName()} - ${game.currentPlayer.hand[i].getType()}`);
			}
		}
		cb();
	});

cd.command('discard [n]', 'Show contents of current player\'s discard')
	.alias('pdc')
	.action(function(args, cb) {
		if( args.n ) {
			this.log('Name: '+game.currentPlayer.discard[args.n-1].getName());
			this.log('Type: '+game.currentPlayer.discard[args.n-1].getType());
			this.log(game.currentPlayer.discard[args.n-1].getText());
		} else {
			for (var i=0; i<game.currentPlayer.discard.length; i++) {
				this.log(`${i+1}.  ${game.currentPlayer.discard[i].getName()} - ${game.currentPlayer.discard[i].getType()}`);
			}
		}
		cb();
	});

cd.command('start', 'Start a game')
	.action(function(args, cb) {
		game.start();
		updatePrompt();
		cb();
	});

cd.command('play <n>', 'Play a card from hand')
	.alias('p')
	.action(function(args, cb) {
		if( args.n==='all') {
			for( let i=game.currentPlayer.hand.length-1; i>=0; i-- ) {
				const c = game.currentPlayer.hand[i];
				this.log(`Playing ${c.getName()}`);
				game.currentPlayer.play(i+1, game);
			}
		} else {
			const c = game.currentPlayer.hand[args.n-1];
			this.log(`Playing ${c.getName()}`);
			game.currentPlayer.play(args.n, game);
		}
		updatePrompt();
		cb();
	});

cd.command('buy <n>', 'Recruit a hero')
	.alias('b')
	.action(function(args, cb) {
		if( args.n==0 ) {
			game.buyShieldOfficer();
			updatePrompt();
		}
		cb();
	});

cd.command('end turn', 'End the current players turn')
	.alias('et')
	.action(function(args, cb) {
		game.endTurn();
		updatePrompt();
		cb();
	});

cd.delimiter('LEGENDARY $')
  .show();
