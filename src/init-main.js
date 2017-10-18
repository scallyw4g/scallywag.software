"use strict";

let Assert = expression => { if (!(expression)) debugger; }
let InvalidCodePath = () => { Assert(false); }

function AnimationStatus() {
  this.cancelled = false;
}

function MakeRoute(Dom) {
  Assert(Dom instanceof HTMLElement);

  this.Name = Dom.dataset.route;

  this.Dom = Dom;
  this.InitialDom = Dom.cloneNode();

  this.Main = null;
  this.Callbacks = null;
  this.AnimationStatus = new AnimationStatus();
  this.UserData = {};
}

function AppState() {
  this.Router = null;
}

function TypedElement(Dom) {
  Assert(Dom instanceof HTMLElement);

  const Content = Dom.innerHTML.split("");
  Dom.innerHTML = "";

  this.Content = Content;
  this.Dom = Dom;
}

let PageLoaded = () => {
  let Result = document.readyState === 'complete';
  return Result;
}

let WaitTillLoaded = setInterval( () => {
  if ( PageLoaded() ) {
    clearInterval(WaitTillLoaded);
    Init().then ( (State) => Main(State) );
  }
}, 5);

let wait = (ms, Route) => {
  Assert(Route instanceof MakeRoute);

  return new Promise( (resolve, reject) => {
    if (Route.AnimationStatus.cancelled) reject("Wait")
    else setTimeout( () => { resolve(); }, ms)
  });
}

let SetVisibility = (element, vis) => {
  Assert(element instanceof HTMLElement);
  element.style.visibility = vis;
}

let ToggleDisplay = (element, d1, d2) => {
  Assert(element instanceof HTMLElement);
  let display = window.getComputedStyle(element).display;

  if (display === d1) {
    element.style.display = d2;

  } else if (display === d2) {
    element.style.display = d1;

  } else { InvalidCodePath() }
}

let SetDisplay = (element, display) => {
  Assert(element instanceof HTMLElement);
  element.style.display = display;
}

let PurgeCursors = (Dom) => {
  Assert(Dom instanceof HTMLElement);
  Array.from(Dom.getElementsByClassName("typing-active"))
    .forEach( Element => Element.classList.remove("typing-active") );
}

let typeText = (Elem, Route, finalDelay = 500) => {
  Assert(Elem instanceof TypedElement);
  Assert(Route instanceof MakeRoute);
  Assert(Route.AnimationStatus instanceof AnimationStatus);

  let charAnimInterval = 50;

  PurgeCursors(Route.Dom);
  Elem.Dom.classList.add("typing-active");

  return new Promise( (resolve, reject) => {

    // Copy so we can re-use Elem.Content if we re-navigate through this route
    let text = Array.from(Elem.Content);

    let TextAnimation = setInterval( () => {

      if (Route.AnimationStatus.cancelled) {
        clearInterval(TextAnimation);
        reject( "typeText " + Elem.Content.join(""));
        return;
      }

      if (text.length == 0) {
        clearInterval(TextAnimation);

        setTimeout(() => {
          resolve();
        },
        finalDelay );

        return;
      }

      Elem.Dom.innerHTML += text.shift();
    }, charAnimInterval );

  });
}

let SetHeight = (Dom, Bounds) => {
  Assert(Dom instanceof HTMLElement);
  Dom.style.height = Bounds.bottom - Bounds.top;;
}

let Global_State = new AppState();
let Global_bindUserCallbackData = { State: Global_State, pendingUserCallbacks: 0 };

let UserCallback = ( callback => {
  ++Global_bindUserCallbackData.pendingUserCallbacks;

  document.addEventListener( USER_CALLBACKS_START, (Event) => {
    --Global_bindUserCallbackData.pendingUserCallbacks;
    callback(Event.detail.State);
  });
});

let SetStateDom = (State) => {
  Assert(State instanceof AppState);
}

let Render = (Element) => {
  Assert(Element instanceof HTMLElement);

  let Dom = Global_State.Dom;
  Dom.innerHTML = "";
  document.body.innerHTML = "";

  Dom.appendChild(Element)
  console.log("render");
  document.body.appendChild(Dom);
}


// TODO(Jesse): Polyfill CustomEvent for <IE9 ?
let BindUserCallbacks = (State) => {

  return new Promise( (resolve) => {

    let event = new CustomEvent(USER_CALLBACKS_START, {detail: Global_bindUserCallbackData});
    document.dispatchEvent(event);

    let WaitForUserCallbacks = setInterval( () => {
      if (Global_bindUserCallbackData.pendingUserCallbacks === 0) {
        clearInterval(WaitForUserCallbacks);
        resolve();
      }
    }, 25);

  });
}

let Init = () => {
  return new Promise ( (resolve) => {
    let State = Global_State;

    let Dom = document.createElement("div");
    document.body.appendChild(Dom);

    Global_State.Dom = Dom;

    State.Router = new MakeRouter("/vim");

    console.log("Start: BindUserCallbacks");
    BindUserCallbacks(State).then( () => {
      console.log("Finish: Bind User Callbacks");
      let event = new CustomEvent(USER_CALLBACKS_COMPLETE, {detail: State});
      document.dispatchEvent(event);
    });

    resolve(State);
  });
}

let Main = (State) => {
  Assert(State instanceof AppState);

  let Router = State.Router;
  Assert(Router instanceof MakeRouter);

  SetDisplay(document.body, DISPLAY_BLOCK);

}
