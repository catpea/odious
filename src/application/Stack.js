export default class Stack {
  application;
  settings;
  elements;

  constructor(application) {
    this.application = application;
    this.settings = new this.application.classes.Settings(this.application.storagePrefix, 'stack', this.defaultSettings);
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
    await this.add('Main');
    this.#started = true;

  }

  async stop(){
    await this.settings.stop();
  }

  // API

  async add(name){
    const id = name.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
    const scene = new Scene(id, name, this.application);
    this.elements.add(scene);
    await scene.start();
  }

  get(name){
    const id = name.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
    return this.elements.get(id);
  }

}

class Scene {
  id;
  name;
  application;

  constructor(id, name, application) {
    this.id = id;
    this.name = name;
    this.application = application;
    this.settings = new this.application.classes.Settings(this.application.storagePrefix, 'scene-'+id, this.defaultSettings);
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

  async add(classId){
    const Class = this.application.library.get(classId);
    if(!Class) throw new Error(`Component classId ${classId} not found.`)
    const component = new Class(this);
    component.id = classId + '-' + Math.random().toString(36).substring(2, 10);
    this.elements.add(component);
    await component.start()
  }

  async remove(id){
    const component = this.elements.cache.get(id);
    this.elements.delete(id);
    await component.stop();
  }


}
