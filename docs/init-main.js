"use strict";

const ChainRejection = (Location) => { return Promise.reject(Location) }

const Assert = expression => { if (!(expression)) { console.error("Assertion Failed"); debugger; } }
const InvalidCodePath = () => { Assert(false); }

// This is used to directly look up into Router.routes so it CANNOT have a leading slash
const ROUTE_404     = "404";

const dev_MOUNT_POINT = ""
const prod_MOUNT_POINT = ""

const ROUTE_INTRO       = "/intro";

const ROUTE_VIM         = "/vim";
const ROUTE_VIM_CREDITS = "/vim/credits";
const ROUTE_VIM_INDEX   = "/vim/index";
const ROUTE_VIM_RESUME  = "/vim/resume";

const ROUTE_VIM_BLOG                            = "/vim/blog";
const ROUTE_VIM_BLOG_IMPROVE_TEXT_RENDERING     = "/vim/blog/improving-text-rendering";
const ROUTE_VIM_BLOG_PROFILING_CONTEXT_SWITCHES = "/vim/blog/profiling-context-switches-with-ETW";
const ROUTE_VIM_BLOG_THREAD_PINNING_ON_WINDOWS  = "/vim/blog/thread-pinning-on-windows";
const ROUTE_VIM_BLOG_VOXEL_ENGINE_FAQ           = "/vim/blog/voxel-engine-faq";

const ROUTE_VIM_BLOG_SIMD_PERLIN_NOISE          = "/vim/blog/simd-perlin-noise-i";
const ROUTE_VIM_BLOG_SIMD_PERLIN_NOISE_II       = "/vim/blog/simd-perlin-noise-ii";
const ROUTE_VIM_BLOG_SIMD_PERLIN_NOISE_III      = "/vim/blog/simd-perlin-noise-iii";
const ROUTE_VIM_BLOG_SIMD_PERLIN_NOISE_IV       = "/vim/blog/simd-perlin-noise-iv";

const ROUTE_VIM_BLOG_GUI_I                      = "/vim/blog/gui-i";
const ROUTE_VIM_BLOG_GUI_II                     = "/vim/blog/gui-ii";
const ROUTE_VIM_BLOG_GUI_III                    = "/vim/blog/gui-iii";
const ROUTE_VIM_BLOG_GUI_IV                     = "/vim/blog/gui-iv";

const ROUTE_VIM_BLOG_POOF_I                     = "/vim/blog/poof-i";

const INTRO_ANIM_COMPLETE = "IntroAnimationComplete"
const INDEX_ANIM_COMPLETE = "IndexAnimationComplete"

const FUNC_INIT = "Init";
const FUNC_MAIN = "Main";

function AnimationStatus() {
  this.cancelled = false;
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

const PageLoaded = () => {
  const Result = document.readyState === 'complete';
  return Result;
}

const WaitTillLoaded = setInterval( () => {
  if ( PageLoaded() ) {
    clearInterval(WaitTillLoaded);
    Init().then ( (State) => Main(State) );
  }
}, 5);

const wait = (ms, Route) => {
  Assert(Route instanceof MakeRoute);

  return new Promise( (resolve, reject) => {
    if (Route.AnimationStatus.cancelled) reject("Wait")
    else setTimeout( () => { resolve(); }, ms)
  });
}

const SetVisibility = (element, vis) => {
  Assert(element instanceof HTMLElement);
  element.style.visibility = vis;
}

const ToggleDisplay = (element, d1, d2) => {
  Assert(element instanceof HTMLElement);
  const display = window.getComputedStyle(element).display;

  if (display === d1) {
    element.style.display = d2;

  } else if (display === d2) {
    element.style.display = d1;

  } else { InvalidCodePath() }
}

const SetDisplay = (element, display) => {
  Assert(element instanceof HTMLElement);
  element.style.display = display;
}

const typeText = (Elem, Route, finalDelay = 500) => {
  Assert(Elem instanceof TypedElement);
  Assert(Route instanceof MakeRoute);
  Assert(Route.AnimationStatus instanceof AnimationStatus);

  const charAnimInterval = 45;

  PurgeCursors(document.body);
  Elem.Dom.classList.add("typing-active");

  return new Promise( (resolve, reject) => {

    // Copy so we can re-use Elem.Content if we re-navigate through this route
    const text = Array.from(Elem.Content);

    const TextAnimation = setInterval( () => {

      if (Route.AnimationStatus.cancelled) {
        clearInterval(TextAnimation);
        reject("typeText: " + Elem.Content.join(""));
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

const SetHeight = (Dom, Bounds) => {
  Assert(Dom instanceof HTMLElement);
  Dom.style.height = Bounds.bottom - Bounds.top;;
}

let Global_State = new AppState();
let Global_bindUserCallbackData = { State: Global_State, pendingUserCallbacks: 0 };

const UserCallback = callback => {
  ++Global_bindUserCallbackData.pendingUserCallbacks;

  document.addEventListener( USER_CALLBACKS_START, (Event) => {
    --Global_bindUserCallbackData.pendingUserCallbacks;
    callback(Event.detail.State);
  });
}

const BindRouteCallback = (RouteName, callback, FuncName) => {
  Assert(typeof RouteName === "string");
  Assert(typeof callback === "function");
  Assert(FuncName === FUNC_INIT || FuncName === FUNC_MAIN);

  UserCallback( (State) => {
    console.log(`Binding ${RouteName} ${FuncName}`);

    const Route = LookupRoute(State.Router, RouteName);
    Assert(Route instanceof MakeRoute);
    Route[FuncName] = callback.bind(null, State, Route);
  });
}

const InitCallback = (RouteName, callback) => {
  BindRouteCallback(RouteName, callback, FUNC_INIT);
}

const MainCallback = (RouteName, callback) => {
  BindRouteCallback(RouteName, callback, FUNC_MAIN);
}

const Render = (RoutePath, Router) => {
  Assert(Router instanceof MakeRouter);

  console.log(" -- Render");

  const Dom = document.createElement("div");

  const Path = RoutePath.split('/');
  Assert(Path[0] === "");
  Path.shift();

  let InitFunctionsToCall = [];

  let Table = Router.routes;
  for ( let PathIndex = 0;
        PathIndex < Path.length;
        ++PathIndex )
  {
    const PathSeg = Path[PathIndex];
    const RenderRoute = Table[PathSeg];

    if (RenderRoute) {
      Table = RenderRoute;

      if (RenderRoute.Init)
      {
        InitFunctionsToCall.push(RenderRoute.Init);
        console.log(`*** Calling init on ${PathSeg}`);
      }
      else
      {
        console.log(`!!! Not calling init on ${PathSeg}`);
      }

      const Yield = Dom.getElementsByClassName("yield")[0];

      let DomToUse = RenderRoute.InitialDom;
      let StylesToUse = [];

      if (RenderRoute.RemoteDocument)
      {
        if (0)
        {
          DomToUse = RenderRoute.RemoteDocument.body.children[0];

          // NOTE(Jesse): This is omega-barf, but it's literally the only way of
          // using styles from an external source without appending the entire
          // external source verbatim to the current document.  Sigh..
          let newSheetText = "";
          for (let sheetIndex = 0; sheetIndex < RenderRoute.RemoteDocument.styleSheets.length; ++sheetIndex)
          {
            let srcSheet = RenderRoute.RemoteDocument.styleSheets[sheetIndex];

            for (let ruleIndex = 0; ruleIndex < srcSheet.cssRules.length; ++ruleIndex)
            {
              newSheetText += " " + srcSheet.cssRules[ruleIndex].cssText;
            }
          }

          let newSheet = new CSSStyleSheet();
          newSheet.replaceSync(newSheetText);
          StylesToUse = [newSheet];
        }
        else
        {
          DomToUse = RenderRoute.RemoteDocument.children[0];
        }
      }


      console.log(' -- StylesToUse ', StylesToUse);
      document.adoptedStyleSheets = StylesToUse;

      if (Yield) {
        Yield.outerHTML = DomToUse.cloneNode(true).outerHTML; // TODO(Jesse): Is cloning necessary here?
      } else {
        Dom.appendChild(DomToUse.cloneNode(true));
      }
    }
  }

  document.body.innerHTML = Dom.innerHTML;
  InitFunctionsToCall.forEach( f => f() );
}


// TODO(Jesse): Polyfill CustomEvent for <IE9 ?
const BindUserCallbacks = (State) => {

  return new Promise( (resolve) => {

    const event = new CustomEvent(USER_CALLBACKS_START, {detail: Global_bindUserCallbackData});
    document.dispatchEvent(event);

    const WaitForUserCallbacks = setInterval( () => {
      if (Global_bindUserCallbackData.pendingUserCallbacks === 0) {
        clearInterval(WaitForUserCallbacks);
        resolve();
      }
    }, 25);

  });
}

const Init = () => {
  return new Promise ( (resolve) => {
    const State = Global_State;

    const Dom = document.createElement("div");
    document.body.appendChild(Dom);

    Global_State.Dom = Dom;

    if (document.location.hostname === "localhost")
    {
      State.Router = new MakeRouter(ROUTE_VIM_INDEX, dev_MOUNT_POINT);
    }
    else
    {
      State.Router = new MakeRouter(ROUTE_VIM_INDEX, prod_MOUNT_POINT);
    }

    console.log("Start: BindUserCallbacks");
    BindUserCallbacks(State).then( () => {
      console.log("Finish: Bind User Callbacks");
      const event = new CustomEvent(USER_CALLBACKS_COMPLETE, {detail: State});
      document.dispatchEvent(event);
    });

    resolve(State);
  });
}

const SetCookie = (Cookie) => {
  document.cookie = `${Cookie.name}=${Cookie.value};`
}

const ReadCookie  = (Needle) => {
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

const ClearAllCookies = () => {
  //
  // NOTE(Jesse): You'd think, since cookies are just strings, that the
  // following would work.  Unfortunately, because the web APIs were apparently
  // designed by marsupials with brain damage, that's not the case.  Instead
  // you have to set 'expires' properties to the epoch because .. reasons
  //
  // document.cookie = "";

  document.cookie.split(";").forEach( (cookie) => {
    var eqPos = cookie.indexOf("=");
    var name = cookie.substr(0, eqPos).trim();
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  });

}

const Main = (State) => {
  Assert(State instanceof AppState);

  const Router = State.Router;
  Assert(Router instanceof MakeRouter);

  SetDisplay(document.body, DISPLAY_BLOCK);

  // const IntroComplete = ReadCookie(INTRO_ANIM_COMPLETE);
  // if (IntroComplete === false) {
  //   Router.navigate(ROUTE_INTRO);
  // }

}

const Redirect = (RouteString) => {
  Global_State.Router.navigate(RouteString);
}

const CompleteAnimation = (Route, AnimationName) => {
  Assert(typeof AnimationName === "string");
  Assert(Route instanceof MakeRoute);

  SetCookie({name: AnimationName, value: true});
  // Route.AnimationStatus.cancelled = false;
}

