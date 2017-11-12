FitBottomBar = () => {
  let RouteBounds = document.body.querySelector("#vim").getBoundingClientRect();
  let RouteWidth = RouteBounds.right - RouteBounds.left;
  let BottomBar = document.body.querySelector("#bottom-bar");
  BottomBar.style.width = RouteWidth;
}


UserCallback( (StateIn) => {
  console.log("Binding vim/index callbacks");

  let Route = LookupRoute(StateIn.Router, ROUTE_VIM_INDEX);


  // <piggy>
  // This is bad on memory and should..? could..? be refactored
  document.body.onresize = FitBottomBar.bind(null, Route);
  // </piggy>


  /* Initialize the route
   * ************************************************************************/

  Assert(Route instanceof MakeRoute);

  Route.Init = (State, Route) => {
    Assert(Route instanceof MakeRoute);
    Assert(State instanceof AppState);

    console.log(" ------ Initializing Vim Route");
    let Credits = document.body.querySelector("#credits-link");
    Credits.onclick = e => {State.Router.navigate(ROUTE_VIM_CREDITS);}

    let Intro = document.body.querySelector("#intro-link");
    Intro.onclick = e => {State.Router.navigate(ROUTE_INTRO);}

    let headings = Array.from(document.body.getElementsByClassName("click-expand"));
    headings.forEach( (Elem) => {
      Elem.onclick = (event) => {
        let sibling = event.target.nextElementSibling;
        ToggleDisplay(sibling, DISPLAY_NONE, DISPLAY_BLOCK);
      }
    });

    FitBottomBar();
  }

});

UserCallback( (State) => {
  console.log("binding vim Main");

  let Route = LookupRoute(State.Router, ROUTE_VIM_INDEX);

  Route.Main = (State) => {

    console.log(" ---------------- Vim Main");

    Route.UserData.ElementsToType = Array.from(document.body.getElementsByClassName("gets-typed"))
      .map((Dom) => { return new TypedElement(Dom); });

    Assert(State instanceof AppState);

    let Router = State.Router;
    Assert(Router instanceof MakeRouter);

    let ElementsToType = Route.UserData.ElementsToType;

    InitCursor(ElementsToType[0]);

    let ChainRejection = (Location) => {
      return Promise.reject(Location);
    }

    Route.UserData.Animation = wait(200, Route)
      .then(() => { return blinkCursor(Route, 1)                    }, ChainRejection )
      .then(() => { return wait(100, Route)                         }, ChainRejection )
      .then(() => { return typeText(ElementsToType[0], Route, 150)  }, ChainRejection )
      .then(() => { return typeText(ElementsToType[1], Route)       }, ChainRejection )
      .then(() => { return typeText(ElementsToType[2], Route)       }, ChainRejection )
      .then(() => { return typeText(ElementsToType[3], Route)       }, ChainRejection )
      .then(() => { return typeText(ElementsToType[4], Route)       }, ChainRejection )
      .then(() => { return typeText(ElementsToType[5], Route)       }, ChainRejection )
      .then(() => { return typeText(ElementsToType[6], Route)       }, ChainRejection )
      .then(() => { return typeText(ElementsToType[7], Route)       }, ChainRejection )
      .then(() => { return typeText(ElementsToType[8], Route, 0)    }, ChainRejection )
      .then(() => { return wait(200, Route)                         }, ChainRejection )
      .then(() => { return blinkCursor(Route, 2)                    }, ChainRejection )
      .then(() => { PurgeCursors(document.body); document.body.onclick=null }, ChainRejection )
      .catch( (Location) => { console.log("Animation Cancelled"); document.body.onclick = null });

    // TODO(Jesse): Re-enable this
    document.body.onclick = e => {
      Route.AnimationStatus.cancelled = true;
      Render(ROUTE_VIM_INDEX, Router);
      Route.Init(State, Route);
    }

  }

});

