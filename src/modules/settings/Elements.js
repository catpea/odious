export default class Elements {

  constructor(settings, categoryId, columnId){
    this.settings = settings;
    this.categoryId = categoryId;
    this.columnId = columnId;
    this.cache = new Map();

  }

  [Symbol.iterator]() {
    const list = this.values();
    return list[Symbol.iterator]();
  }

  signal(){
    return this.settings.signal(this.categoryId, this.columnId);
  }
  subscribe(f){
    return this.signal().subscribe(()=>f(this.entries()))
  }
  size(){
    return this.keys().length;
  }
  keys(){
    const keys = this.settings.get(this.categoryId, this.columnId).split(/\s+/).filter(o=>o);
    return keys;
  }

  values(){
    const keys = this.keys();
    const values = keys.map(id=>this.cache.get(id));
    return values;
  }

  entries(){
    const keys = this.keys();
    const entries = keys.map(id=>[id, this.cache.get(id)])
    return entries;
  }

  indexOf(...a){
    const keys = this.keys();
    return keys.indexOf(...a);
  }

  splice(...a){
    const keys = this.keys();
    keys.splice(...a);
    const unique = [...new Set(keys)];
    console.log('unique splice', a, unique, this.settings.get(this.categoryId, this.columnId))

    this.settings.set(this.categoryId, this.columnId, unique.join(' '));
  }

  delete(id){
    this.cache.delete(id);
    const keys = this.keys();
    const unique = [...new Set(keys)];
    const position = unique.indexOf(id);
    unique.splice(position, 1);
    this.settings.set(this.categoryId, this.columnId, unique.join(' '));
  }

  add(object, id=object.id){
    // const id = object.id || object.constructor.id;

    if(!id) throw new TypeError('Object must contain an id property.')

    this.cache.set(id, object);
    const keys = this.keys().concat(id);
    const unique = [...new Set(keys)];
    console.log('unique add', id, unique, this.settings.get(this.categoryId, this.columnId))
    this.settings.set(this.categoryId, this.columnId, unique.join(' '));

  }

  has(id){
    return this.indexOf(id) !== -1;
  }

  get(id){
    return this.has(id)?this.cache.get(id):undefined;
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
