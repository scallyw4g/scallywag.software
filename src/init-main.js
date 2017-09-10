"use strict";

let VISIBILITY_OFF = "hidden";
let VISIBILITY_ON = "visible";

let DISPLAY_INLINE_BLOCK = "inline-block";
let DISPLAY_BLOCK = "block";
let DISPLAY_NONE = "none";

let TypingElement = null;

let InvalidCodePath = () => { Assert(!"InvalidCodePath"); }

let Assert = ( expression ) => {
  if (!(expression)) {
    throw new Error("Failed Assertion").stack;

  }
}

function AppState() {
  this.Router = null;
  this.Cursor = null;
  this.elements = [];
}

let PageLoaded = () => {
  let Result = document.readyState === 'complete';
  return Result;
}

let WaitTillLoaded = setInterval( () => {
  document.body.style.visibility = VISIBILITY_OFF;
  if ( PageLoaded() ) {
    clearInterval(WaitTillLoaded);
    Init().then ( (State) => Main(State) );
  }
}, 5);

function TypedElement(Elem) {
  this.Content = Elem.innerHTML.split("");
  this.FinalBounds = Elem.getBoundingClientRect();

  this.DomElem = Elem;
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


let typeText = (Elem, Cursor, finalDelay = 500) => {
  Assert(Cursor instanceof MakeCursor);
  Assert(Elem instanceof TypedElement);
  let charInterval = 50;

  return new Promise( (resolve, reject) => {

      PrepareToType(Cursor, Elem);
      setTimeout( () => { resolve(); }, charInterval );

  }).then( () => {

    return new Promise( (resolve, reject) => {

      SetVisibility(Elem.DomElem, VISIBILITY_ON);

      let text = Elem.Content;
      Elem.DomElem.innerHTML = "";

      let anim = setInterval( () => {

        if (text.length == 0) {
          setTimeout( () => { clearInterval(anim); resolve(); }, finalDelay );

        } else {
          Elem.DomElem.innerHTML += text.shift();
          UpdateCursorP(Cursor, Elem);
        }

      }, charInterval );
    });

  });
}

let SetHeight = (DomElem, Bounds) => {
  Assert(DomElem instanceof HTMLElement);
  DomElem.style.height = Bounds.bottom - Bounds.top;;
}

let Init = () => {
  return new Promise ( (resolve) => {

    document.body.onresize = () => UpdateCursorP(Cursor, Elem);

    let State = new AppState();

    State.Router = new MakeRouter(window.location.pathname);
    State.Cursor = new MakeCursor(document.getElementById("cursor"));

    let Cursor = State.Cursor;
    let Router = State.Router;

    let RouteElements = Array.from(document.getElementsByClassName("route"));
    let content       = Array.from(document.getElementsByClassName("content"));
    let typedElements = Array.from(document.getElementsByClassName("gets-typed"));

    for ( let RouteIndex = 0;
          RouteIndex < RouteElements.length;
          ++RouteIndex)
    {
      let RouteElem = RouteElements[RouteIndex];
      Router.routes[ RouteElem.dataset.route ] = new MakeRoute(RouteElem);
      SetVisibility(RouteElem, VISIBILITY_OFF);
    }

    // Hack to initialize the cursor
    let firstElem = new TypedElement(typedElements[0]);
    PrepareToType(Cursor, firstElem);

    for ( let Index = 0;
          Index < typedElements.length;
          ++Index)
    {
      let Elem = typedElements[Index];
      State.elements.push(new TypedElement(Elem));

      SetDisplay(Elem, DISPLAY_NONE);
    }

    for ( let Index = 0;
          Index < content.length;
          ++Index)
    {
      let Elem = content[Index];
      SetDisplay(Elem, DISPLAY_NONE);
    }

    document.body.style.visibility = VISIBILITY_ON;

    // TODO(Jesse): Polyfill for <IE9 ?
    let event = new CustomEvent("framework-loaded", {detail: State});
    document.dispatchEvent(event);

    resolve(State);
  });
}

let Main = (State) => {
  let Router = State.Router;
  let Cursor = State.Cursor;
  let elements = State.elements;

  Assert(Router instanceof MakeRouter);
  Assert(Cursor instanceof MakeCursor);
  Assert(elements);

  Router.navigate("vim", State);

  let headings = Array.from(document.getElementsByClassName("heading"));

  for ( let headingIndex = 0;
        headingIndex < headings.length;
        ++headingIndex )
  {
    let Elem = headings[headingIndex];

    Elem.onclick = (event) => {
      let sibling = event.target.nextElementSibling;
      ToggleDisplay(sibling, DISPLAY_NONE, DISPLAY_BLOCK);
    }

  }
}
