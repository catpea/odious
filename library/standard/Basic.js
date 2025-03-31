
class Noop {
  static defaults = {
    main:{
      name:'Noop',
      description: 'Non operational example component',
      type: 'standard:basic:noop',
    },
  };
  static ports = {};

  constructor(id, application, scene) {
    this.id = id;
    this.application = application;
    this.scene = scene;
    console.log('this.defaults', this.constructor.defaults)
    this.settings = new this.application.classes.Settings(this.application.storagePrefix, this.id, this.constructor.defaults);
  }

  #started = false;
  get started(){
    return this.#started;
  }

  async start(){
    if (this.#started) throw new Error('already started');
    await this.settings.start(); // await synchronization with storage/database
    // await this.elements.start(); // await synchronization with storage/database
    this.#started = true;
  }

  async stop(){
    await this.settings.stop();
    this.collectGarbage();
  }



  initialize() {}
  pause() {}
  resume() {}
  dispose() {}
  execute(){}

}



export default class StandardBasic {
  library;
  entries;

  constructor(library) {
    this.library = library;

    this.entries = [
      Noop,
    ];

  }

  [Symbol.iterator]() {
    return this.entries[Symbol.iterator]();
  }

}
