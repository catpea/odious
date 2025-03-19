const mapStorage = new Map();
import Synchronizable from '../../synchronizable/Synchronizable.js';

export default class ServerNode {

  get(key){
    return mapStorage.get(key);
  }
  set(o){
    for (const [key, value] of Object.entries(o)){
      mapStorage.set(key, value);
    }
    return new Promise((resolve) =>  resolve());
  }
  remove(...o){
    for (const key of Object.entries(o.flat())){
      mapStorage.remove(key);
    }
  }
  clear(){
    mapStorage.clear()
  }

  #started = false;
  #stopWatching;
  get started(){return this.#started;}
  async start(prefix, data){
    if (this.#started) throw new Error('already started');
    await this.seed(prefix, data);
    this.#stopWatching = await this.watch(prefix, data);
    this.#started = true;
  }

  async seed(prefix, data){
    const defaults = {
      'v1-test:application.settings:author:name:data': JSON.stringify({revision:2, revisionId:'x-defaults-test', content:'Alice Smith'})
    };
    for( const [key, value] of Object.entries(defaults) ){
      if(key.startsWith(prefix)){
        const {revision, revisionId, content} = this.decode(value);
        console.log('XXXXXXXXX', key, {revision, revisionId, content})
        if(!data.has(key)) data.set(key, new Synchronizable());
        data.get(key).remote(revision, revisionId, content);
      }
    }
  }

  async watch(prefix, data){
  }
  async stop(){
  }


  decode(str){
    return JSON.parse(str);
  }
  encode(obj){
    return JSON.stringify(obj);
  }

}
