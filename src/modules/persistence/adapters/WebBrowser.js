export default class WebBrowser {

  get(key){
    return localStorage.getItem(key);
  }
  set(o){
    for (const [key, value] of Object.entries(o)){
      localStorage.setItem(key, value);
    }
    return new Promise((resolve) =>  resolve());
  }
  remove(...o){
    for (const key of Object.entries(o.flat())){
      localStorage.removeItem(key);
    }
  }
  clear(){
    localStorage.clear()
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
    for( const [key, value] of Object.entries(localStorage.getItem()) ){
      if(key.startsWith(prefix)){
        const {revision, revisionId, data} = this.decode(value);
        data.signal(key).remote(revision, revisionId, data);
      }
    }
  }

  async watch(prefix, data){
    const listener = event => {
      const correctKey = event.key.startsWith(prefix);
      if(!correctKey) return;
      const changeOccured = event.newValue !== event.oldValue;
      if(!changeOccured) return;
      const {revision, revisionId, data} = this.decode(event.newValue);
      data.signal(key).remote(revision, revisionId, data);
    };
    window.addEventListener('storage', listener);
    return ()=>window.removeEventListener('storage', listener);
  }
  async stop(){
    this.#stopWatching();
  }



  decode(str){
    return JSON.parse(str);
  }
  encode(obj){
    return JSON.stringify(obj);
  }

}
