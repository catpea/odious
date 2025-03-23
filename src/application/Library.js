export default class Library {
  application;
  settings;
  elements;

  constructor(application) {
    this.application = application;
    this.settings = new this.application.classes.Settings(this.application.storagePrefix, 'library', this.defaultSettings);
    this.elements = new this.application.classes.Settings.Elements(this.settings, 'elements', 'value');
  }





  #started = false;

  get started(){
    return this.#started;
  }

  async start(){

    if (this.#started) throw new Error('already started');

    await this.settings.start(); // await synchronization with storage/database
    await this.elements.start(); // await synchronization with storage/database

    this.#started = true;
  }

  async stop(){
    await this.settings.stop();
  }






  async load(url){
    const {default:Class} = await import(url);
    const instance = new Class(this.application);
    this.elements.cache.set(instance.id, instance);
    this.elements.splice(-1, 0, instance.id);
  }

}
