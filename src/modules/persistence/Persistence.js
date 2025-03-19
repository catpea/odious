import WebExtension from './adapters/WebExtension.js';
import WebBrowser from './adapters/WebBrowser.js';
import ServerNode from './adapters/ServerNode.js';

export default class Persistence {

  adapter;

  constructor(){
    console.log('env', this.environment());

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
    return this.adapter.get(...a);
  }

  set(...a){
    return this.adapter.set(...a);
  }

  remove(...a){
    return this.adapter.remove(...a);
  }

  environment(){
      const isNode = (typeof process !== 'undefined' && process.versions && process.versions.node);
      const isWebExtension = (typeof browser !== 'undefined' && browser.runtime && browser.runtime.id) || (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id);
      const isBrowser = (typeof window !== 'undefined' && typeof window.document !== 'undefined');

      if (isNode) {
          return 'Node.js';
      } else if (isWebExtension) {
          return 'Web Extension';
      } else if (isBrowser) {
          return 'Web Browser';
      } else {
          return 'Unknown';
      }
  }
}
