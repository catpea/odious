const application = new Application();

await application.library.install('base-tools.js');
await application.library.install('tone-js.js');
await application.scenes.load('tutorial-scene.js');
await application.ui.start();
