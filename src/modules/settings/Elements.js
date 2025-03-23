export default class Elements {

  constructor(settings, categoryId, columnId){
    this.settings = settings;
    this.categoryId = categoryId;
    this.columnId = columnId;
    this.cache = new Map();

  }

  [Symbol.iterator]() {
    const list = this.settings.get(this.categoryId, this.columnId).split(/\s+/).filter(o=>o).map(id=>this.cache.get(id));
    return list[Symbol.iterator]();
  }

  splice(...a){
    const list = this.settings.get(this.categoryId, this.columnId).split(/\s+/);
    list.splice(...a);
    this.settings.set(this.categoryId, this.columnId, list.join(' '))
  }

  #started = false;

  get started(){
    return this.#started;
  }

  async start(){

    if (this.#started) throw new Error('already started');
    await this.settings.start(); // await synchronization with storage/database
    this.settings.set(this.categoryId, this.columnId, '');
    this.#started = true;
  }

  async stop(){
  }

}
