import Elements from './Elements.js';
import Synchronizable from './memory/synchronizable/Synchronizable.js';

const memory = new Map();

export default class Ephemerals {
  static Elements = Elements;
  #defaultValues;
  constructor(defaultValues = {}){
    this.#defaultValues = defaultValues;
  }
  #started = false;
  get started(){return this.#started;}
  async start(defaults){
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
    memory.clear();
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
    if(!memory.has(pathKey)) {
      const synchronizable = new Synchronizable();
      memory.set(pathKey, synchronizable);
    }
    memory.get(pathKey).value = value;
  }

  keyOf(categoryId, columnId){
    return [ categoryId, columnId, 'data' ].join(':');
  }

}
