"use strict";

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

      SetVisibility(Elem.DomElem, VISIBILITY_OFF);

      let text = Elem.Content;

      let firstPass = true;

      let TextAnimation = setInterval( () => {
        if (text.length == 0) {
          clearInterval(TextAnimation);
          setTimeout(() => { resolve(); }, finalDelay );
          return;
        }


        if (firstPass) {
          Elem.DomElem.innerHTML = text.shift();
          SetVisibility(Elem.DomElem, VISIBILITY_ON);
          firstPass = false;
        } else {
          Elem.DomElem.innerHTML += text.shift();
        }

        UpdateCursorP(Cursor, Elem);

      }, charInterval );
    });

  });
}

let SetHeight = (DomElem, Bounds) => {
  Assert(DomElem instanceof HTMLElement);
  DomElem.style.height = Bounds.bottom - Bounds.top;;
}

let PrepareToTypeRouteElements = (DomElem, Cursor) => {
  Assert(DomElem instanceof HTMLElement);
  Assert(Cursor instanceof MakeCursor);

  let elementsToType = Array.from(DomElem.getElementsByClassName("gets-typed"));

  let firstElem = new TypedElement(elementsToType[0]);
  PrepareToType(Cursor, firstElem);

  let Result = [];

  for ( let Index = 0;
        Index < elementsToType.length;
        ++Index)
  {
    let Elem = elementsToType[Index];
    Result.push(new TypedElement(Elem));

    SetDisplay(Elem, DISPLAY_NONE);
  }

  return Result;
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

let Init = () => {
  return new Promise ( (resolve) => {

    // FIXME(Jesse): Reposition cursor on resize
    // document.body.onresize = () => UpdateCursorP(Cursor, Elem);

    let State = Global_State;

    State.Cursor = new MakeCursor(document.getElementById("cursor"));
    State.Router = new MakeRouter();
    State.Router.alias("/", "/vim");

    let Cursor = State.Cursor;
    let Router = State.Router;

    // TODO(Jesse): Polyfill CustomEvent for <IE9 ?

    Router.Initialize();

    let event = new CustomEvent(USER_CALLBACKS_START, {detail: Global_bindUserCallbackData});
    console.log("dispaching %s", USER_CALLBACKS_START);
    document.dispatchEvent(event);

    SetDisplay(document.body, DISPLAY_BLOCK);

    let WaitForUserCallbacks = setInterval( () => {
      if (Global_bindUserCallbackData.pendingUserCallbacks === 0) {
        let event = new CustomEvent(USER_CALLBACKS_COMPLETE, {detail: State});
        console.log("dispaching %s", USER_CALLBACKS_COMPLETE);
        document.dispatchEvent(event);
        clearInterval(WaitForUserCallbacks);
      }
    }, 500);


    resolve(State);
  });
}

let Main = (State) => {
  let Router = State.Router;
  let Cursor = State.Cursor;

  Assert(Router instanceof MakeRouter);
  Assert(Cursor instanceof MakeCursor);

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
