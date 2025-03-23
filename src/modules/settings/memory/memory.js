import Persistence from './persistence/Persistence.js';
import Synchronizable from './synchronizable/Synchronizable.js';

class Memory {
  data;

  constructor(persistence){
    this.garbage = new Set();
    this.data = new Map();
    this.persistence = persistence;
  }

  #started = false;
  get started(){return this.#started;}
  async start(storageApi){
    if (this.#started) throw new Error('already started');
    this.#started = true;
    await this.persistence.start(storageApi, this);
  }

  async stop(){
    this.garbage.forEach(Ƒ=>Ƒ());
    await this.persistence.stop();
  }

  // NOTE: add adds blank signal, does not support setting value
  add(pathKey){
      const synchronizable = new Synchronizable();
      this.data.set(pathKey, synchronizable);
      this.data.get(pathKey).subscribe((content, oldValue, revision, revisionId)=>console.warn({[pathKey]: JSON.stringify({revision, revisionId, content})}))
      const Χ = this.data.get(pathKey).subscribe((content, oldValue, revision, revisionId)=>{

        // WARNING: the storage may already contain the same value, if the database is web browser, and the update came in as storage change, the change will be real to this tab instance, but it will not have to save it, as it has already happened, this means it was just a notification from notehr tab.

        const currentValue = this.persistence.get(pathKey);
        const newValue = JSON.stringify({revision, revisionId, content});
        if( currentValue != newValue ) this.persistence.set({[pathKey]: newValue});

      })
      this.garbage.add(Χ);
  };

  has(pathKey){
    if(! this.#started) throw new Error('Memory is not ready, await.')
    return this.data.has(pathKey);
  }

  get(pathKey){
    if(! this.#started) throw new Error('Memory is not ready, await.');
    return this.data.get(pathKey);
  }

  set(pathKey, value){
    if(! this.#started) throw new Error('Memory is not ready, await.')
    console.log('Memory Set', pathKey, value)

    if(!this.has(pathKey)) this.add(pathKey);

    this.data.get(pathKey).value = value;
  }

}

const memory = new Memory(new Persistence());
export default memory;
