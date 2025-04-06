// import UI from './src/ui/UI.js';
import Application from './src/application/Application.js';

const application = new Application();
globalThis.application = application;
await application.start(); // JOIN

// TODO: these items must be loaded from the database
// await application.library.load('/library/standard/Mock.js');
// await application.stack.add('Upperify');
// await application.stack.get('main').add('standard:basic:noop', 'ccc');

// const ui = new UI();
// await ui.start();


// setTimeout(()=>{  application.settings.set('author', 'name', 'zerocool'); }, 1_000)

// setTimeout(()=>{ application.stack.get('main') .add('standard:basic:noop', 'aaa'); }, 2_000)
// setTimeout(()=>{ application.stack.get('upperify') .add('standard:basic:noop', 'bbb'); }, 3_000)

// setTimeout(()=>{ application.stack.get('main') .remove('aaa'); }, 4_000)
