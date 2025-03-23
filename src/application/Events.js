export default class Events {

  subscribers = {};
  // Event handling methods
  on(event, callback) {
    // Register a callback for an event
    if (!this.subscribers[event]) {
      this.subscribers[event] = [];
    }
    this.subscribers[event].push(callback);
    return () => this.off(event, callback);
  }

  once(event, callback) {
    // Register a callback that is called at most once
    const onceWrapper = (...args) => {
      callback(...args);
      this.off(event, onceWrapper);
    };
    this.on(event, onceWrapper);
  }

  off(event, callback) {
    // Unregister a callback for an event
    if (!this.subscribers[event]) return;
    this.subscribers[event] = this.subscribers[event].filter(
      (cb) => cb !== callback,
    );
  }

  emit(event, ...args) {
    // Emit an event, calling all registered callbacks
    if (!this.subscribers[event]) return;
    // Create a copy of the subscribers array to prevent issues if a callback modifies the subscribers during execution
    const subscribers = this.subscribers[event].slice();
    for (const callback of subscribers) {
      callback(...args);
    }
  }

}
