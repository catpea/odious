import UI from './src/ui/UI.js';
import Application from './src/application/Application.js';

const application = new Application();
await application.library.install('base-tools.js');
await application.library.install('tone-js.js');

await application.stack.load('tutorial-stack.js');

await application.start();

const ui = new UI();
await ui.start();
