import Card from '../card.js';

class Bystander extends Card {
  constructor() {
  	super();
  }

  getVp() {
  	return 1;
  }

  static getName() {
  	return 'Bystander';
  }

  static getType() {
  	return 'Bystander';
  }

  static getText() {
  	return '';
  }
}

export default Bystander;
