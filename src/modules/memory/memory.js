import Persistence from '../persistence/Persistence.js';
import Synchronizable from '../synchronizable/Synchronizable.js';

class Memory {
  data;

  constructor(persistence){
    this.data = new Map();
    this.persistence = persistence;
  }

  #started = false;
  get started(){return this.#started;}
  async start(storageApi){
    if (this.#started) throw new Error('already started');
    await this.persistence.start(storageApi, this.data);
    this.#started = true;
  }

  async stop(){
    await this.persistence.stop();
  }

  has(...a){
    if(! this.#started) throw new Error('Memory is not ready, await.')
    return this.data.has(...a);
  }

  get(pathKey){
    if(! this.#started) throw new Error('Memory is not ready, await.');
    console.log('AAAAA memory get', pathKey)
    return this.data.get(pathKey);
  }

  set(pathKey, value){
    if(! this.#started) throw new Error('Memory is not ready, await.')
    if(!this.has(pathKey)) this.data.set(pathKey, new Synchronizable());
    this.data.get(pathKey).value = value;
  }

}

const memory = new Memory(new Persistence());
export default memory;
