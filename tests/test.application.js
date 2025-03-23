import Application from 'application';
const application = new Application();
// https://devhints.io/chai

describe("Application", () => {

  let application;

  before(async () => {

    // NOTE: some initial test storage data;
    localStorage.clear();
    localStorage.setItem('v1:application.settings:author:serial:data', JSON.stringify({revision:4, revisionId:'base36-defaults-test', content:'mxyzptlk-vyndktvx'}))

    application = new Application();
    await application.start()
  });

  after(async () => {
    // Reset any stateful properties here
    // await application.stop();
  });

  describe(".start()", async () => {

    it("should report started as true", () => {

      chai.expect(application.started).to.be.true;
      chai.expect(application.settings.started).to.be.true;

    });

  });

  describe(".settings...", () => {

    it("should report correct information from raw application defaults", () => {
      chai.expect(application.settings.get('author', 'name')).to.equal('user');
      chai.expect(application.settings.get('author', 'email')).to.equal('user@localhost');
    });

    it("should increment revision when value is updated", () => {
      chai.expect(application.settings.signal('author', 'name').revision).to.equal(2);
      application.settings.set('author', 'name', 'zerocool');
      chai.expect(application.settings.get('author', 'name')).to.equal('zerocool');
      chai.expect(application.settings.signal('author', 'name').revision).to.equal(3);
    });

    it("should use value from localStorage", () => {
      chai.expect(application.settings.signal('author', 'serial').revision).to.equal(4);
      chai.expect(application.settings.get('author', 'serial')).to.equal('mxyzptlk-vyndktvx');
    });

    it("should synchronize updates", () => {
      application.settings.set('author', 'name', 'n00b');
      application.settings.set('author', 'name', 'hunter2');
      chai.expect(application.settings.signal('author', 'name').revision).to.equal(5);
      chai.expect(application.settings.get('author', 'name')).to.equal('hunter2');
    });

  });

  describe(".library...", () => {

    it("should fetch and register a standard library module", async () => {
      await application.library.load('/library/standard/Basic.js');
      chai.expect([...application.library.elements.cache.keys()].length ).to.equal(1);
      chai.expect(application.library.elements.cache.get('@standard/basic').id ).to.equal('@standard/basic');
      chai.expect([...application.library.elements.cache.keys()] ).to.deep.equal([ '@standard/basic' ]);
    });

    it("should contain Beacon class", async () => {
      chai.expect(application.library.elements.cache.get('@standard/basic').Beacon.name ).to.equal('Beacon');
    });

  });

});
