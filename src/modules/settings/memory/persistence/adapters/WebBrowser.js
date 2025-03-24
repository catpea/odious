export default class WebBrowser {

  get(key){
    return localStorage.getItem(key);
  }
  set(o){
    // console.log('WebBrowser.set', o)
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
  #stopWatchingLocalStorage;
  get started(){return this.#started;}
  async start(prefix, memory){
    if (this.#started) throw new Error('already started');
    await this.seed(prefix, memory);
    this.#stopWatchingLocalStorage = await this.watch(prefix, memory);
    this.#started = true;
  }

  async seed(prefix, memory){
    // console.log('Object.entries(localStorage)', Object.entries(localStorage))
    for( const [key, value] of Object.entries(localStorage) ){
      if(key.startsWith(prefix)){
        const {revision, revisionId, content} = this.decode(value);
        if(!memory.has(key)) memory.add(key);
        memory.get(key).remote(revision, revisionId, content);
      }
    }
  }

  async watch(prefix, memory){
    console.log('WATCHING!');


    const listener = event => {
      console.log('HEARD CHANGE!!!!!!!!!!!...', event )
      if(!event.key) return;
      const key = event.key;

      const correctKey = key.startsWith(prefix);
      if(!correctKey) return;
      const changeOccurred = event.newValue !== event.oldValue;
      if(!changeOccurred) return;
      const {revision, revisionId, content} = this.decode(event.newValue);
      if(!memory.has(key)) memory.add(key);
      memory.get(key).remote(revision, revisionId, content);
    };
    window.addEventListener('storage', listener);
    return ()=>window.removeEventListener('storage', listener);
  }
  async stop(){
    console.log('#stopWatchingLocalStorage!');
    this.#stopWatchingLocalStorage();
  }



  decode(str){
    return JSON.parse(str);
  }
  encode(obj){
    return JSON.stringify(obj);
  }
  listenTo(thing, event, listener){
    if (!thing || !event || !listener) { throw new Error('All arguments (thing, event, listener) must be provided'); }
    const boundListener = listener.bind(this);
    thing.addEventListener(event, boundListener);
    return ()=>thing.removeEventListener(event, boundListener);
  }
}
