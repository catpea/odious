
class Beacon {
  static caption = 'Beacon';
  static description = 'Emit a number every N milliseconds.';
  static defaults = { counter: {kind: 'field', label:'Counter', type: 'Number', data:0},  milliseconds: {kind: 'field', label:'Milliseconds', type: 'Number', data:10_000, step:100, min:300},};
  static ports = {out:{side:'out', icon:'activity'}};

  initialize() {}
  start(){
    //TODO: scene start event, likely when all children of a scene report ready
    setTimeout(() => {
      // Automatically start the process
      this.execute()
    },666);
  }
  pause() {}
  resume() {}
  stop() {
    this.collectGarbage();
  }
  dispose() {}
  execute(){
    const outputPipe = this.outputPipe('out');
    if(outputPipe){
      this.settings.set('counter', 'data', this.settings.get('counter', 'data') + 1 );
      const options = { };
      const data = this.settings.get('counter', 'data');
      this.outputPipe('out').receive(data, options);
    }
    const reactivate = this.settings.get('milliseconds', 'data');
    //console.log({reactivate})
    this.setTimeout( this.execute.bind(this), reactivate);
  }
}

export default class LibraryStandardBasic {
  id = '@standard/basic';

  Beacon = Beacon;

  application;

  constructor(application) {
    this.application = application;
  }



}
