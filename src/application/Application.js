import Settings from "../modules/settings/Settings.js";

import Events from "./Events.js";
import Library from "./Library.js";
import Stack from "./Stack.js";

export default class Application {
  id = 'application';
  storagePrefix = 'v1'; // when incremented all data will be abandoned to previous version, and program will start blank

  defaultSettings = {
    author: {
      name: 'user',
      email: 'user@localhost',
      serial: 'mxyzptlk-vyndktvx',
    }
  }

  settings;
  events;
  library;
  stack;

  constructor() {

    this.settings = new Settings(this.storagePrefix, 'application.settings', this.defaultSettings);
    this.events = new Events(); // system events suchh as adding/removing a node in a scene
    this.library = new Library(); // where components are registered
    this.stack = new Stack(); // this is the scene stack, the program

  }

  #started = false;

  get started(){
    return this.#started;
  }

  async start(){

    if (this.#started) throw new Error('already started');

    await this.settings.start(); // await synchronization with storage/database

    this.#started = true;
  }

  async stop(){
    await this.settings.stop();
  }

}
