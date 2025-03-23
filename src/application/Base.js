export default Shared {

  listenTo(thing, event, listener){
    if (!thing || !event || !listener) { throw new Error('All arguments (thing, event, listener) must be provided'); }
    const boundListener = listener.bind(this);
    thing.addEventListener(event, boundListener);
    return ()=>thing.removeEventListener(event, boundListener);
  }

  // GARBAGE COLLECTED TIMEOUT
  setTimeout(timeoutFunction, timeoutDuration, type = "timeout") {
    const timeoutGuid = guid();
    const timeoutId = setTimeout(() => {
      this.#garbage.splice(
        this.#garbage.findIndex((o) => o.id === timeoutGuid),
        1,
      );
      timeoutFunction();
    }, timeoutDuration);

    this.#garbage.push({
      type,
      id: timeoutGuid,
      ts: new Date().toISOString(),
      subscription: () => {
        clearTimeout(timeoutId);
      },
    });

    return ()=>clearTimeout(timeoutId);
  }
  clearTimeouts(type) {
    const matches = this.#garbage
      .filter((o) => o.type === type)
      .map((s) => s.subscription());
    this.#garbage = this.#garbage.filter((o) => o.type !== type);
  }

  // GARBAGE COLLECTION

  #garbage = [];
  collectGarbage() {
    this.#garbage.map((s) => s.subscription());
  }
  set gc(subscription) {

    if (typeof subscription !== 'function') {
      throw new Error('gc subscription must be a function');
    }

    // shorthand for component level garbage collection
    this.#garbage.push({
      type: "gc",
      id: "gc-" + this.#garbage.length,
      ts: new Date().toISOString(),
      subscription,
    });
  }

}
