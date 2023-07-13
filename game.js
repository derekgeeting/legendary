import _ from 'lodash';
import MasterStrike from './cards/masterstrikes/masterstrike.js';
import Bystander from './cards/bystanders/bystander.js';
import Player from './player.js';
import ShieldAgent from './cards/heroes/shield_agent.js';
import ShieldTrooper from './cards/heroes/shield_trooper.js';
import ShieldOfficer from './cards/heroes/shield_officer.js';

class Game {
  constructor(logger) {
  	this.mastermind = null;
  	this.villainDeck = [];
  	this.woundDeck = [];
  	this.heroDeck = [];
  	this.bystanderDeck = [];
  	this.scheme = null;
  	this.players = [];

  	this.settings = {
  		mastermind: null,
  		heroes: [],
  		villains: [],
  		henchmen: [],
  		playerNames: ['player1', 'player2'],
  		scheme: null
  	}
  }

  isReady() {
  	return this.settings.mastermind !== null && this.settings.scheme !== null;
  }

  start() {
  	if( this.isReady() ) {
  		this.settings.mastermind.init(this);
  		this.settings.scheme.init(this);

  		for( let i=0; i<5; i++ ) {
  			this.villainDeck.push( new MasterStrike() );
  		}

  		for( let i=0; i<2; i++ ) {
  			this.villainDeck.push( new Bystander() );
  		}

  		this.villainDeck = _.shuffle(this.villainDeck);

  		for( let i=0; i<this.settings.playerNames.length; i++ ) {
  			const p = new Player(this.settings.playerNames[i]);
  			this.players.push(p);
  			for( let j=0; j<8; j++) {
  				p.deck.push( new ShieldAgent() );
  			}
  			for( let j=0; j<4; j++) {
  				p.deck.push( new ShieldTrooper() );
  			}
  			p.deck = _.shuffle(p.deck);

  			p.drawHand();
  		}

  		this.currentPlayer = this.players[0];
  		this.currentPlayerIndex = 0;
  		this.startTurn();
  	}
  }

  playTopVillainCard() {

  }

  startTurn() {
  	this.currentPlayer.slashes = 0;
  	this.currentPlayer.money = 0;
  	this.currentPlayer.playedCards = [];
  	this.playTopVillainCard();
  }

  endTurn() {
  	this.currentPlayer.slashes = 0;
  	this.currentPlayer.money = 0;
  	this.currentPlayer.playedCards = [];
  	while( this.currentPlayer.hand.length > 0 ) {
  		this.currentPlayer.discard.push(this.currentPlayer.hand.pop());
  	}
  	while( this.currentPlayer.playedCards.length > 0 ) {
  		this.currentPlayer.discard.push(this.currentPlayer.playedCards.pop());
  	}
  	this.currentPlayer.drawHand();
  	this.currentPlayerIndex++;
  	if (this.currentPlayerIndex >= this.players.length) {
  		this.currentPlayerIndex = 0;
  	}
  	this.currentPlayer = this.players[this.currentPlayerIndex];
  	this.startTurn();
  }

  buyShieldOfficer() {
  	if (this.currentPlayer.money >= ShieldOfficer.getCost()) {
  		this.currentPlayer.money -= ShieldOfficer.getCost();
  		this.currentPlayer.discard.push( new ShieldOfficer() );
  	}
  }
}

export default Game;