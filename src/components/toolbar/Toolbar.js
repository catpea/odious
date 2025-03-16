import Signal from 'signal';
import lol from 'lol';
import transcend from 'transcend';
import guid from 'guid';
import gui from 'gui';
import CONFIGURATION from 'configuration';

export default class Console extends HTMLElement {

    constructor() {
      super();
      this.status = new Signal('loading');

      const localStyle = `

        .horizontal-menu {
         	position: absolute;
          top: 1rem;
          left: 5rem;
          gap: 1em;
        }

        .vertical-menu {
         	position: absolute;
          top: 1rem;
          left: 1rem;
        }



        .my-vertical {
          pointer-events: none;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
        }

        .btn-group-vertical {
          pointer-events: auto;  /* fix overflow and get riid of pointer events, no time now */
        }

        button[disabled] {
          opacity: .35 ! important;
        }

      `;
      const localCss = new CSSStyleSheet();
      localCss.replaceSync(localStyle.trim());

      const shadow = this.attachShadow({ mode: 'open' });
      shadow.adoptedStyleSheets = [...document.adoptedStyleSheets, localCss];

      this.horizontal = lol.div({class:'horizontal-menu d-flex flex-row'});
      this.vertical = lol.div({class:'vertical-menu'});
      this.container = lol.div({class:'position-relative'}, this.horizontal, this.vertical);

      shadow.appendChild(this.container);


      let speedControl = false;
      if(speedControl) this.horizontal.appendChild(lol.div({innerHTML:`
          <div class="application-speed" style="min-width: 200px;">
            <label for="application-speed" class="form-label d-none"><small>Speed: <span name="application-speed-label">100%</span></small></label>
            <input name="application-speed" type="range" min="0" max="1" step="0.01" value="1" class="form-range" id="application-speed">
          </div>
      `}));

      this.vertical.appendChild(lol.div({innerHTML:`
        <div class="btn-toolbar my-vertical">
          <div class="btn-group-vertical mb-2 d-none" role="group" aria-label="First group">
            <button name="application-play" type="button" class="btn btn-outline-secondary" title="Send Start"><i class="bi bi-play"></i></button>
            <button name="application-pause" type="button" class="btn btn-outline-secondary" title="Send Start"><i class="bi bi-pause"></i></button>
            <!--

            <button type="button" class="btn btn-outline-secondary opacity-25" title="Send Stop"><i class="bi bi-stop"></i></button>
            <button type="button" class="btn btn-outline-secondary opacity-25" title="Send Kill"><i class="bi bi-capsule"></i></button>
            -->
          </div>

            <div class="btn-group-vertical mb-2">
             <!-- <button name="create-window" type="button" class="btn btn-outline-secondary d-none" title="create window"><i class="bi bi-plus-circle"></i></button> -->
              <button name="delete-active" type="button" class="btn btn-outline-secondary" title="delete selected"><i class="bi bi-x-circle"></i></button>
            </div>
              <!--

            <div class="btn-group-vertical mb-2">
              <button type="button" class="btn btn-outline-secondary opacity-25" title="Clear Stage"  data-bs-content="Clear the stage of all actors and begin a new project."><i class="bi bi-eraser"></i></button>
              <button type="button" class="btn btn-outline-secondary opacity-25" title="Open File"  data-bs-content="Load data from your computer."><i class="bi bi-folder2-open"></i></button>
              <button type="button" class="btn btn-outline-secondary opacity-25"><i class="bi bi-save"></i></button>
              <button type="button" class="btn btn-outline-secondary opacity-25" title="New Block"  data-bs-content="Add a new function to your program."><i class="bi bi-tools"></i></button>
            </div>

            <div class="btn-group-vertical mb-2">
              <button type="button" class="btn btn-outline-secondary opacity-25" title="Generate Code"  data-bs-content="Generate a standalone program that does not require sweetpea to run."><i class="bi bi-box-seam"></i></button>
              <button type="button" class="btn btn-outline-secondary opacity-25" title="Save Program"  data-bs-content="Save project to your computer."><i class="bi bi-floppy"></i></button>
              <button type="button" class="btn btn-outline-secondary opacity-25" title="Function Creator"  data-bs-content="Add a new function to your program."><i class="bi bi-puzzle"></i></button>

              <button type="button" class="btn btn-outline-secondary opacity-25"><i class="bi bi-zoom-in"></i></button>
              <button type="button" class="btn btn-outline-secondary opacity-25"><i class="bi bi-zoom-out"></i></button>
              <button type="button" class="btn btn-outline-secondary opacity-25"><i class="bi bi-aspect-ratio"></i></button>
              -->

            </div>

            <div class="btn-group-vertical mb-2 d-none">
              <button name="main-scene" type="button" class="btn btn-outline-secondary" title="Switch to main scene"><i class="bi bi-arrow-return-left"></i></button>
            </div>


          </div>
      `}));

    }

    connectedCallback() {




      const application = transcend(this, `x-application`);
      const scene = transcend(this, `x-scene`);
      if(!application) throw new Error('Unable to locate applicaion!')

      if(0){
        const applicationSpeedRangeInput = this.container.querySelector('[name="application-speed"]');
        const applicationSpeedLabel = this.container.querySelector('[name="application-speed-label"]');
        // CONFIGURATION.rate.subscribe(v=>applicationSpeedLabel.textContent = `${100*v}% (${parseInt(CONFIGURATION.flowDuration.value)}ms/${parseInt(CONFIGURATION.computationDuration.value)}ms)`);
        CONFIGURATION.rate.subscribe(v=>applicationSpeedLabel.textContent = `${(100*v).toFixed(0)}%`);
        const applicationSpeedRangeInputHandler = function(event){
          CONFIGURATION.rate.value =    1 * event.target.value;
        }.bind(this);
        applicationSpeedRangeInput.addEventListener("input", applicationSpeedRangeInputHandler)
        this.gc = ()=> applicationSpeedRangeInput.removeEventListener("input", applicationSpeedRangeInputHandler)
        applicationSpeedRangeInput.value = CONFIGURATION.rate.value;
      }



      const applicationPlayButton = this.container.querySelector('[name="application-play"]');
      const applicationPauseButton = this.container.querySelector('[name="application-pause"]');
      // INITIAL STATE
      applicationPlayButton.disabled = true;
      applicationPauseButton.disabled = false;
      // SET ABILITY
      CONFIGURATION.paused.subscribe(paused=>{
        if(paused){
          applicationPlayButton.disabled = false;
          applicationPauseButton.disabled = true;
        }else{
          applicationPlayButton.disabled = true;
          applicationPauseButton.disabled = false;
        }
      });
      //ACTIONS
      const applicationPlayButtonHandler = function(event){
        CONFIGURATION.paused.value = false;
      }.bind(this);
      applicationPlayButton.addEventListener("click", applicationPlayButtonHandler)
      this.gc = ()=> applicationPlayButton.removeEventListener("click", applicationPlayButtonHandler)

      const applicationPauseButtonHandler = function(event){
        CONFIGURATION.paused.value = true;
      }.bind(this);
      applicationPauseButton.addEventListener("click", applicationPauseButtonHandler)
      this.gc = ()=> applicationPauseButton.removeEventListener("click", applicationPauseButtonHandler)








      // const createWindowButton = this.container.querySelector('[name="create-window"]');
      // createWindowButton.addEventListener("click", function (e) {
      //   let [left, top] = scene.getCenterDropCoordinates();
      //   [left, top] = [left, top].map(o=>o*.5)
      //   const id = guid();//.substr(0,10);
      //   application.source.commander.windowCreate({id, left, top, active:true});
      // });





      const deleteActiveButton = this.container.querySelector('[name="delete-active"]');
      const deleteActiveButtonFunction = () => {
        const id = this.scene.active.value;
        this.scene.active.value = false;
        application.source.commander.componentDelete({id});

      }
      deleteActiveButton.addEventListener("click", deleteActiveButtonFunction);
      this.gc = () => deleteActiveButton.removeEventListener("click", deleteActiveButtonFunction);
      this.scene.active.subscribe(active=>{
        if(active){
          deleteActiveButton.classList.remove(...Array.from(deleteActiveButton.classList).filter(className => className.startsWith('btn-outline-')) )
          deleteActiveButton.classList.add('btn-outline-danger');
          deleteActiveButton.disabled = false;
        }else{
          deleteActiveButton.classList.remove(...Array.from(deleteActiveButton.classList).filter(className => className.startsWith('btn-outline-')) )
          deleteActiveButton.classList.add('btn-outline-secondary');
          deleteActiveButton.disabled = true;
        }
      });





      const mainSceneButton = this.container.querySelector('[name="main-scene"]');

      mainSceneButton.addEventListener("click", function (e) {
        application.source.commander.sceneSelect({id:'main'});
      });

      application.source.activeLocation.subscribe(activeLocation=>{
        if(activeLocation==='main'){
          mainSceneButton.classList.remove(...Array.from(mainSceneButton.classList).filter(className => className.startsWith('btn-outline-')) )
          mainSceneButton.classList.add('btn-outline-secondary');
          mainSceneButton.classList.add('d-none');
          mainSceneButton.disabled = true;
        }else{
          mainSceneButton.classList.remove(...Array.from(mainSceneButton.classList).filter(className => className.startsWith('btn-outline-')) )
          mainSceneButton.classList.add('btn-outline-success');
          mainSceneButton.classList.remove('d-none');
          mainSceneButton.disabled = false;
        }
      })







      this.status.value = 'ready';
    }

    get scene(){
      return transcend(this, `x-scene`);
    }

  }
