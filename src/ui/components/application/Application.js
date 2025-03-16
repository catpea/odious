import Signal from 'signal';

export default class Application extends HTMLElement {

    project;

    constructor() {
      super();
      this.status = new Signal('loading');
      // const localStyle = `.bork { padding: default; }`;
      // const localCss = new CSSStyleSheet();
      // localCss.replaceSync(localStyle.trim());
      // shadow.adoptedStyleSheets = [...document.adoptedStyleSheets, localCss];
      // const shadow = this.attachShadow({ mode: 'open' });
      // const container = document.createElement('div');
      // container.innerHTML = `<x-scene></x-scene>`;
      // this.appendChild(container);
      //
      //
    /*
    <!-- NOTE: iframe to handle the Blob redirection -->
    <iframe id="downloadIframe" style="display:none;"></iframe>
    <!-- NOTE: iframe to handle file opening -->
    <input type="file" id="fileInput" style="display: none;" />
    */
    }

    connectedCallback() {
      this.status.value = 'ready';
    }

  }
