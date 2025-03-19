import Settings from "../modules/settings/Settings.js";

import Events from "./Events.js";
import Library from "./Library.js";
import Stack from "./Stack.js";

export default class Application {
  id = 'application';
  storageApi = 'v1'; // when incremented all data will be abandoned to previous version, and program will start blank

  defaultSettings = {
    author: {
      name: 'user',
      email: 'user@localhost',
    }
  }

  settings;
  events;
  library;
  stack;

  #started = false;
  get started(){return this.#started;}
  async start(){
    if (this.#started) throw new Error('already started');
    await this.settings.start(); // await synchronization with storage/database
    this.#started = true;
  }
  async stop(){
    await this.settings.stop();
  }
  constructor() {

    settings = new Settings(this.storageApi, 'application.settings', this.defaultSettings);
    events = new Events();
    library = new Library();
    stack = new Stack();

  }
}
