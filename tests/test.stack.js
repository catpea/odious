import Application from 'application';
const application = new Application();
// https://devhints.io/chai

describe("Application Scene Stack", () => {

  let application;

  before(async () => {
    application = new Application();
    await application.start()
  });

  after(async () => {
    await application.stop();
  });

  describe("Add Scene", () => {

    it("should have scene Main", async () => {

      const scenes = application.stack.elements.values();
      chai.expect( scenes.length ).to.equal(1);
      chai.expect( scenes[0].id ).to.equal('main');
      chai.expect( scenes[0].name ).to.equal('Main');

    });

    it("should add a scene Upperify", async () => {

      await application.stack.add('Upperify');
      const scenes = application.stack.elements.values();
      chai.expect( scenes.length ).to.equal(2);
      chai.expect( scenes[1].id ).to.equal('upperify');
      chai.expect( scenes[1].name ).to.equal('Upperify');

    });

  });

  describe("Add Component To Scene", () => {

    it("should add noop to main scene", async () => {
      await application.library.load('/library/standard/Mock.js');
      await application.stack.get('main').add('standard:basic:noop');
      const components = application.stack.elements.get('main').elements.keys();
      chai.expect( components.length ).to.equal(1);
      chai.expect( components ).to.deep.equal([ "standard:basic:noop" ]);
    });

  });

});
