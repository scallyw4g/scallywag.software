FitBottomBar = () => {
  let RouteBounds = document.body.querySelector("#vim").getBoundingClientRect();
  let RouteWidth = RouteBounds.right - RouteBounds.left;
  let BottomBar = document.body.querySelector("#bottom-bar");
  BottomBar.style.width = RouteWidth;
}

BindBottomBarCallbacks = (State) => {
  Assert(State instanceof AppState);
  let Home = document.body.querySelector("#home-link");
  Home.onclick = e => {State.Router.navigate("/");}

  let Credits = document.body.querySelector("#credits-link");
  Credits.onclick = e => {State.Router.navigate(ROUTE_VIM_CREDITS);}

  let Intro = document.body.querySelector("#intro-link");
  Intro.onclick = e => {ClearAllCookies(); State.Router.navigate(ROUTE_INTRO);}
}

InitCallback(ROUTE_VIM_INDEX, (State, Route) => {
  Assert(State instanceof AppState);
  Assert(Route instanceof MakeRoute);
  console.log(" ------ Initializing Vim Route");

  // <piggy>
  // This is bad on memory and should..? could..? be refactored
  document.body.onresize = FitBottomBar.bind(null, Route);
  // </piggy>

  let headings = Array.from(document.body.getElementsByClassName("click-expand"));
  headings.forEach( (Elem) => {
    Elem.onclick = (event) => {
      let sibling = event.target.nextElementSibling;
      ToggleDisplay(sibling, DISPLAY_NONE, DISPLAY_BLOCK);
    }
  });

  BindBottomBarCallbacks(State);
  FitBottomBar();
});

MainCallback(ROUTE_VIM_INDEX, (State, Route) => {
  Assert(State instanceof AppState);
  Assert(Route instanceof MakeRoute);

  if (!ReadCookie(INDEX_ANIM_COMPLETE)) {
    let ElementsToType = Array.from(document.body.getElementsByClassName("gets-typed"))
      .map((Dom) => { return new TypedElement(Dom); });

    InitCursor(ElementsToType[0]);

    let CompleteAnimation = () => {
      document.body.onclick = null;
      SetCookie({name: INDEX_ANIM_COMPLETE, value: true});
    }

    wait(200, Route)
      .then( () => { return blinkCursor(Route, 1)                      }, ChainRejection )
      .then( () => { return wait(100, Route)                           }, ChainRejection )
      .then( () => { return typeText(ElementsToType[0], Route, 150)    }, ChainRejection )
      .then( () => { return typeText(ElementsToType[1], Route)         }, ChainRejection )
      .then( () => { return typeText(ElementsToType[2], Route)         }, ChainRejection )
      .then( () => { return typeText(ElementsToType[3], Route)         }, ChainRejection )
      .then( () => { return typeText(ElementsToType[4], Route)         }, ChainRejection )
      .then( () => { return typeText(ElementsToType[5], Route)         }, ChainRejection )
      .then( () => { return typeText(ElementsToType[6], Route)         }, ChainRejection )
      .then( () => { return typeText(ElementsToType[7], Route)         }, ChainRejection )
      .then( () => { return typeText(ElementsToType[8], Route, 0)      }, ChainRejection )
      .then( () => { return wait(200, Route)                           }, ChainRejection )
      .then( () => { return blinkCursor(Route, 2)                      }, ChainRejection )
      .then( () => { PurgeCursors(document.body); CompleteAnimation(); }, ChainRejection )
      .catch(() => { console.log("Animation Cancelled"); CompleteAnimation(); });

    document.body.onclick = e => {
      Route.AnimationStatus.cancelled = true;
      Render(ROUTE_VIM_INDEX, State.Router);
      Route.Init(State, Route);
    }
  }
});

