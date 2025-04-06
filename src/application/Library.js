export default class Library {
  application;
  settings;
  elements;

  constructor(application) {
    this.application = application;
    this.settings = new this.application.classes.Settings(this.application.storagePrefix, 'library', this.defaultSettings);
    this.ephemerals = new this.application.classes.Ephemerals(this.defaultEphemerals);

    this.locations = new this.application.classes.Settings.Elements(this.settings, 'locations', 'value');

    this.elements = new this.application.classes.Settings.Elements(this.ephemerals, 'elements', 'value');

  }

  #started = false;

  get started(){
    return this.#started;
  }

  async start(){

    if (this.#started) throw new Error('already started');

    await this.settings.start(); // await synchronization with storage/database
    await this.ephemerals.start(); // await start
    await this.locations.start(); // await synchronization with storage/database
    await this.elements.start(); // await synchronization with storage/database

    this.locations.subscribe(async entries => {
      const urls = entries.filter(([url,object])=>!object?.instance).map(([url])=>url);
      for ( const url of urls ){
        const {default:Class} = await import(url);
        const instance = new Class(this);
        this.locations.cache.set(url, {...this.locations.cache.get(url), instance});
        console.log('INSTANCE', instance);
        for ( const item of instance ){
          this.elements.add(item, item.defaults.main.type);
        }
      }
    });

    this.#started = true;

  }



  // API

  async stop(){
    await this.settings.stop();
  }

  async load(url){
    this.locations.add({id:url, instance:null});
  }

  get(id){
    return this.elements.get(id);
  }

  list(){
    return this.elements.entries();
  }

}
