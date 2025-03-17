import Events from "./Events.js";
import Library from "./Library.js";
import Stack from "./Stack.js";

export default class Application {
  events = new Events();
  library = new Library();

  stack = new Stack();

  constructor() {

    // this does not override values, if they are present
    this.synchronizables.initializeDefaults({

      settings: { // <-- categories are not signals, just plain objects
        name: "untitled", // <-- category entries become signals
        title: "Untitled",
        note: "",
        style: null,
        list: [1,2,3] // <-- the entire array is contined in one signal, only category values are wrapped in signals
      },

      selection: {
        active: false,
        selected: false,
      },

      coordinates: {
        zindex: 0,
        left: 0,
        top: 0,
        width: null,
        height: null,
      },

      ports: {
        in: { side: "in", icon: "activity" },
        out: { side: "out", icon: "activity" },
      },

      fields: {

        counter: {
          label: "Counter",
          type: "Number",
          data: 0
        },

        milliseconds: {
          label: "Milliseconds",
          type: "Number",
          data: 10_000,
          step: 100,
          min: 300,
        },
      },
    });

  }
}
