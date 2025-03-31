// import UI from './src/ui/UI.js';
import Application from './src/application/Application.js';

const application = new Application();
globalThis.application = application;
await application.start();

await application.library.load('/library/standard/Mock.js');
await application.stack.add('Upperify');
await application.stack.get('main').add('standard:basic:noop', 'ccc');



// const ui = new UI();
// await ui.start();
