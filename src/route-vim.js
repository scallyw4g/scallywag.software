
UserCallback( (StateIn) => {
  console.log("binding vim Init/Teardown callbacks");

  /*
   * Inline helper to show click-expand headings
   */
  let DisplayHeadings = function (Route) {
    let headings = Array.from(Route.Dom.getElementsByClassName("click-expand"));
    headings.forEach( (Elem) => {
      Elem.onclick = (event) => {
        let sibling = event.target.nextElementSibling;
        ToggleDisplay(sibling, DISPLAY_NONE, DISPLAY_BLOCK);
      }
    });
  }

  let BindClickCallbacks = function (Route, State) {
    let Credits = Route.Dom.querySelector("#credits-link");
    Credits.onclick = e => {State.Router.navigate("/credits");}

    let Intro = Route.Dom.querySelector("#intro-link");
    Intro.onclick = e => {State.Router.navigate("/intro");}
  }


  let Route = StateIn.Router.routes["/vim"];

  Route.FitBottomBar = (Route) => {
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

  DisplayHeadings(Route);
  BindClickCallbacks(Route, StateIn);

  Route.Init = () => {
    DisplayHeadings(Route);
    BindClickCallbacks(Route, StateIn);

    Route.FitBottomBar(Route);
  }

  Route.Dom.onclick = e => {
    Route.AnimationStatus.cancelled = true
    delete Route.Dom;
    Route.Dom = Route.InitialDom.cloneNode(true);
    Render(Route.Dom);
    Route.Init();
  }

});

UserCallback( (State) => {
  console.log("binding vim Main");

  let Route = State.Router.routes["/vim"];

  Route.Main = (State) => {

    Route.UserData.ElementsToType = Array.from(Route.Dom.getElementsByClassName("gets-typed"))
      .map((Dom) => { return new TypedElement(Dom); });

    Assert(State instanceof AppState);

    let Router = State.Router;
    Assert(Router instanceof MakeRouter);

    let ElementsToType = Route.UserData.ElementsToType;

    InitCursor(ElementsToType[0]);

    let ChainRejection = (Location) => {
      return new Promise( (_, reject) => { reject(Location); });
    }

    Route.FitBottomBar(Route);

    Route.UserData.Animation = wait(200, Route)
      .then(() => { return blinkCursor(Route, 1)                    }, (RejectionLocation) => { return ChainRejection(RejectionLocation) })
      .then(() => { return wait(100, Route)                         }, (RejectionLocation) => { return ChainRejection(RejectionLocation) })
      .then(() => { return typeText(ElementsToType[0], Route, 150)  }, (RejectionLocation) => { return ChainRejection(RejectionLocation) })
      .then(() => { return typeText(ElementsToType[1], Route)       }, (RejectionLocation) => { return ChainRejection(RejectionLocation) })
      .then(() => { return typeText(ElementsToType[2], Route)       }, (RejectionLocation) => { return ChainRejection(RejectionLocation) })
      .then(() => { return typeText(ElementsToType[3], Route)       }, (RejectionLocation) => { return ChainRejection(RejectionLocation) })
      .then(() => { return typeText(ElementsToType[4], Route)       }, (RejectionLocation) => { return ChainRejection(RejectionLocation) })
      .then(() => { return typeText(ElementsToType[5], Route)       }, (RejectionLocation) => { return ChainRejection(RejectionLocation) })
      .then(() => { return typeText(ElementsToType[6], Route)       }, (RejectionLocation) => { return ChainRejection(RejectionLocation) })
      .then(() => { return typeText(ElementsToType[7], Route)       }, (RejectionLocation) => { return ChainRejection(RejectionLocation) })
      .then(() => { return typeText(ElementsToType[8], Route, 0)    }, (RejectionLocation) => { return ChainRejection(RejectionLocation) })
      .then(() => { return wait(200, Route)                         }, (RejectionLocation) => { return ChainRejection(RejectionLocation) })
      .then(() => { return blinkCursor(Route, 2)                    }, (RejectionLocation) => { return ChainRejection(RejectionLocation) })
      .then(() => { PurgeCursors(Route.Dom); Route.Dom.onclick=null }, (RejectionLocation) => { return ChainRejection(RejectionLocation) })
      .catch( (Location) => { Route.Dom.onclick = null });
  }

});

