
UserCallback( (StateIn) => {
  console.log("Binding vim/main callbacks");

  let Route = LookupRoute(StateIn.Router, ROUTE_VIM_MAIN);

  Route.FitBottomBar = () => {
    let RouteBounds = Route.Dom.getBoundingClientRect();
    let RouteWidth = RouteBounds.right - RouteBounds.left;

    let BottomBar = Route.Dom.querySelector("#bottom-bar");
    BottomBar.style.width = RouteWidth;
  }


  // <piggy>
  // This is bad on memory and should..? could..? be refactored
  document.body.onresize = Route.FitBottomBar.bind(null, Route);
  // </piggy>


  /* Initialize the route
   * ************************************************************************/

  Assert(Route instanceof MakeRoute);

  Route.Init = (State, Route) => {
    Assert(Route instanceof MakeRoute);
    Assert(State instanceof AppState);

    console.log(" ------ Initializing Vim Route");
    let Credits = Route.Dom.querySelector("#credits-link");
    Credits.onclick = e => {State.Router.navigate(ROUTE_CREDITS);}

    let Intro = Route.Dom.querySelector("#intro-link");
    Intro.onclick = e => {State.Router.navigate(ROUTE_INTRO);}

    let headings = Array.from(Route.Dom.getElementsByClassName("click-expand"));
    headings.forEach( (Elem) => {
      Elem.onclick = (event) => {
        let sibling = event.target.nextElementSibling;
        ToggleDisplay(sibling, DISPLAY_NONE, DISPLAY_BLOCK);
      }
    });

    Route.FitBottomBar();
  }

});

UserCallback( (State) => {
  console.log("binding vim Main");

  let Route = LookupRoute(State.Router, ROUTE_VIM_MAIN);

  Route.Main = (State) => {

    console.log(" ---------------- Vim Main", Route);

    Route.UserData.ElementsToType = Array.from(Route.Dom.getElementsByClassName("gets-typed"))
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
      .then(() => { PurgeCursors(Route.Dom); Route.Dom.onclick=null }, ChainRejection )
      .catch( (Location) => { Route.Dom.onclick = null });

  }

  // TODO(Jesse): Re-enable this
  // Route.Dom.onclick = e => {
  //   Route.AnimationStatus.cancelled = true;
  //   delete Route.Dom;
  //   Route.Dom = Route.InitialDom.cloneNode(true);
  //   Render(Route.Dom);
  //   Route.Init();
  // }


});

