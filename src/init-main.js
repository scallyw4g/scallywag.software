"use strict";

let Assert = expression => { if (!(expression)) { console.error("Assertion Failed"); debugger; } }
let InvalidCodePath = () => { Assert(false); }

// This is used to directly look up into Router.routes so it CANNOT have a leading slash
let ROUTE_404     = "404";

let ROUTE_INTRO   = "/intro";
let ROUTE_VIM_CREDITS = "/vim/credits";
let ROUTE_VIM_INDEX = "/vim/index";

function AnimationStatus() {
  this.cancelled = false;
}

function MakeRoute(DomRef) {
  Assert(DomRef instanceof HTMLElement);

  this.Name = DomRef.dataset.route;

  this.InitialDom = DomRef.cloneNode(true);
  this.Dom = null;

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

let typeText = (Elem, Route, finalDelay = 500) => {
  Assert(Elem instanceof TypedElement);
  Assert(Route instanceof MakeRoute);
  Assert(Route.AnimationStatus instanceof AnimationStatus);

  let charAnimInterval = 50;

  PurgeCursors(document.body);
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

let Render = (RoutePath, Router) => {
  Assert(Router instanceof MakeRouter);
  console.log("render");

  let Dom = document.createElement("div");

  let Path = RoutePath.split('/');
  Assert(Path[0] === "");
  Path.shift();

  let Table = Router.routes;
  for ( let PathIndex = 0;
        PathIndex < Path.length;
        ++PathIndex )
  {
    let PathSeg = Path[PathIndex];
    let RenderRoute = Table[PathSeg];

    if (RenderRoute) {
      Table = RenderRoute;

      let Yield = Dom.getElementsByClassName("yield")[0];
      if (Yield) {
        Yield.outerHTML = RenderRoute.InitialDom.outerHTML;
      } else {
        Dom.appendChild(RenderRoute.InitialDom);
      }
    }
  }

  document.body.innerHTML = Dom.innerHTML;
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

    State.Router = new MakeRouter(ROUTE_VIM_INDEX);

    console.log("Start: BindUserCallbacks");
    BindUserCallbacks(State).then( () => {
      console.log("Finish: Bind User Callbacks");
      let event = new CustomEvent(USER_CALLBACKS_COMPLETE, {detail: State});
      document.dispatchEvent(event);
    });

    resolve(State);
  });
}

let SetCookie = (Cookie) => {
  document.cookie = `${Cookie.name}=${Cookie.value};`
}

let ReadCookie  = (Needle) => {
  let Result = false;

  document.cookie.split(";").forEach( (cookie) => {
    var eqPos = cookie.indexOf("=");
    var Name = cookie.substr(0, eqPos).trim();
    if (Name === Needle) {
      Result = cookie.substr(eqPos+1, cookie.length);
    }
  });

  switch (Result) {
    case "true":
      Result = true;
    break;

    case "false":
      Result = false;
    break;
  }

  return Result;
}

let ClearAllCookies = () => {
  document.cookie.split(";").forEach( (cookie) => {
    var eqPos = cookie.indexOf("=");
    var name = cookie.substr(0, eqPos).trim();
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  });
}

let Main = (State) => {
  Assert(State instanceof AppState);

  let Router = State.Router;
  Assert(Router instanceof MakeRouter);

  SetDisplay(document.body, DISPLAY_BLOCK);

  let IntroComplete = ReadCookie("IntroCompleted");
  if (IntroComplete === false) {
    Router.navigate(ROUTE_INTRO);
  }

}
