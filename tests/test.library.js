import Application from 'application';
const application = new Application();
// https://devhints.io/chai

describe("Application Component Library", () => {

  let application;

  before(async () => {
    application = new Application();
    await application.start()
  });

  after(async () => {
    await application.stop();
  });

  describe(".load(url)", () => {

    it("should fetch and register a standard library module", async () => {

      await application.library.load('/library/standard/Mock.js');

      const actualBlocks = application.library.elements.keys();
      const expectedBlocks = [ "standard:basic:noop", "standard:basic:beacon" ];

      chai.expect(actualBlocks).to.deep.equal(expectedBlocks);

    });

  });

  describe(".list()", () => {

    it("should list library modules", async () => {

      chai.expect( application.library.list().length ).to.equal(2);

    });

  });

});
