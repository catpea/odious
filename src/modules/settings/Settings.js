import memory from './memory/memory.js';
import Elements from './Elements.js';

export default class Settings {

  static Elements = Elements;

  #storageApi;
  #objectId;
  #defaultValues;

  constructor(storageApi, objectId, defaultValues = {}){
    this.#storageApi = storageApi;
    this.#objectId = objectId;
    this.#defaultValues = defaultValues;
  }

  #started = false;
  get started(){return this.#started;}
  async start(defaults){

    // if (this.#started) throw new Error('already started');
    if(!memory.started) await memory.start(this.#storageApi);

    for( const [categoryId, columns] of Object.entries(this.#defaultValues) ){
      for( const [columnId, defaultValue] of Object.entries(columns) ){
        const pathKey = this.keyOf(categoryId, columnId);
        if(!memory.has(pathKey)){
          memory.set(pathKey, defaultValue);
        }
      }
    }

    this.#started = true;
  }
  async stop(){
    await memory.stop();
  }

  has(categoryId, columnId){
    const pathKey = this.keyOf(categoryId, columnId);
    return memory.has(pathKey);
  }

  signal(categoryId, columnId){
    const pathKey = this.keyOf(categoryId, columnId);
    return memory.get(pathKey);
  }

  get(categoryId, columnId){
    const pathKey = this.keyOf(categoryId, columnId);
    return memory.get(pathKey).value;
  }

  set(categoryId, columnId, value){
    const pathKey = this.keyOf(categoryId, columnId);
    memory.set(pathKey, value);
  }

  keyOf(categoryId, columnId){
    return [ this.#storageApi, this.#objectId, categoryId, columnId, 'data' ].join(':');
  }

}
