import Settings from "../modules/settings/Settings.js";

import Events from "./Events.js";
import Library from "./Library.js";
import Stack from "./Stack.js";

export default class Application {
  id = 'application';
  prefix = 'v1'; // when incremented all data will be abandoned to previous version, and program will start blank

  defaults = {
    author: {
      name: 'user',
      email: 'user@localhost',
      serial: 'mxyzptlk-vyndktvx',
    }
  }

  classes = {
    Settings,
  };

  settings;
  events;
  library;
  stack;

  constructor() {

    this.settings = new Settings(this.prefix, 'application.settings', this.defaults);

    this.events = new Events(this); // system events suchh as adding/removing a node in a scene
    this.library = new Library(this); // where components are registered
    this.stack = new Stack(this); // this is the scene stack, the program

  }

  #started = false;

  get started(){
    return this.#started;
  }

  async start(){

    if (this.#started) throw new Error('already started');

    await this.settings.start();
    await this.library.start();
    await this.stack.start();

    this.#started = true;

  }

  async stop(){

    await this.settings.stop();
    await this.library.stop();
    await this.stack.stop();

    this.#started = false;


  }

}
