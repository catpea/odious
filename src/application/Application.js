import Events from './Events.js';
import Library from './Library.js';
import Stack from './Stack.js';

export default class Application {

  events = new Events();
  library = new Library();

  stack = new Stack();

  constructor(){

  }

}
