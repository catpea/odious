import WebExtension from './adapters/WebExtension.js';
import WebBrowser from './adapters/WebBrowser.js';
import ServerNode from './adapters/ServerNode.js';

export default class Persistence {

  adapter;

  constructor(){
    console.info('Persistence Envirnonment: ', this.environment());

    switch (this.environment()) {
      case 'Node.js':
        this.adapter = new ServerNode();
        break;
      case 'Web Extension':
        this.adapter = new WebExtension('local');
        break;
      case 'Web Browser':
        this.adapter = new WebBrowser();
        break;
      default:
        console.log(`Unrecognized environment.`);
    }

  }

  #started = false;
  get started(){return this.#started;}
  async start(...a){
    if (this.#started) throw new Error('already started');
    await this.adapter.start(...a);
    this.#started = true;
  }
  async stop(){
    await this.adapter.stop();
  }

  has(...a){
    return this.adapter.has(...a);
  }

  get(...a){
    console.log('Persistence Get: ', ...a)
    return this.adapter.get(...a);
  }

  set(...a){
    console.log('Persistence Set: ', ...a)
    return this.adapter.set(...a);
  }

  remove(...a){
    return this.adapter.remove(...a);
  }

  environments = new Map([
    ['Node.js', ()=>(typeof process !== 'undefined' && process.versions && process.versions.node)],
    ['Web Browser', ()=>(typeof window !== 'undefined' && typeof window.document !== 'undefined')],
    ['Web Extension', ()=>(typeof browser !== 'undefined' && browser.runtime && browser.runtime.id) || (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id)],
  ]);

  environment(){
    for (const [name, check] of this.environments) {
      if(check()) return name;
    }
  }

}
