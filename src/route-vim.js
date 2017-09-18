
UserCallback( (StateIn) => {
  console.log("binding vim Init/Teardown callbacks");

  let Route = StateIn.Router.routes["/vim"];

  Route.Teardown = () => {
    Assert(Route instanceof MakeRoute);
    console.log("Tearing down /vim");

    Route.UserData.ElementsToType
      .forEach( Element => {
        Assert(Element instanceof TypedElement);
        Assert(Element.Dom instanceof HTMLElement);
        Element.Dom.innerHTML = "";
      });
  }

  let headings = Array.from(Route.Dom.getElementsByClassName("heading"));

  headings.forEach( (Elem) => {
    Elem.onclick = (event) => {
      console.log('click');
      let sibling = event.target.nextElementSibling;
      ToggleDisplay(sibling, DISPLAY_NONE, DISPLAY_BLOCK);
    }
  });

  Route.FitBottomBar = (Route) => {
    let MainBounds = Route.Dom.querySelector("#vim-inner").getBoundingClientRect();
    let width = MainBounds.right - MainBounds.left;

    let BottomBar = Route.Dom.querySelector("#bottom-bar");
    BottomBar.style.width = width;
  }

  Route.Initialize = (State) => {
    Assert(Route instanceof MakeRoute);

    Route.UserData.ElementsToType = Array.from(Route.Dom.getElementsByClassName("gets-typed"))
      .map((Dom) => { return new TypedElement(Dom); });

    let Credits = Route.Dom.querySelector("#credits-link");
    Credits.onclick = e => {State.Router.navigate("/credits");}

    let Intro = Route.Dom.querySelector("#intro-link");
    Intro.onclick = e => {State.Router.navigate("/intro");}

    Route.uninitialized = false;
  }

  // <piggy>
  // This is bad on memory and should..? could..? be refactored
  document.body.onresize = Route.FitBottomBar.bind(null, Route);
  // </piggy>


  Route.Initialize(StateIn);
});

UserCallback( (State) => {
  console.log("binding vim Main");

  let Route = State.Router.routes["/vim"];
  Route.Main = (State) => {
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
      .then(() => { return blinkCursor(Route, 1)                   }, (RejectionLocation) => { return ChainRejection(RejectionLocation) })
      .then(() => { return wait(100, Route)                        }, (RejectionLocation) => { return ChainRejection(RejectionLocation) })
      .then(() => { return typeText(ElementsToType[0], Route, 150) }, (RejectionLocation) => { return ChainRejection(RejectionLocation) })
      .then(() => { return typeText(ElementsToType[1], Route)      }, (RejectionLocation) => { return ChainRejection(RejectionLocation) })
      .then(() => { return typeText(ElementsToType[2], Route)      }, (RejectionLocation) => { return ChainRejection(RejectionLocation) })
      .then(() => { return typeText(ElementsToType[3], Route)      }, (RejectionLocation) => { return ChainRejection(RejectionLocation) })
      .then(() => { return typeText(ElementsToType[4], Route)      }, (RejectionLocation) => { return ChainRejection(RejectionLocation) })
      .then(() => { return typeText(ElementsToType[5], Route)      }, (RejectionLocation) => { return ChainRejection(RejectionLocation) })
      .then(() => { return typeText(ElementsToType[6], Route)      }, (RejectionLocation) => { return ChainRejection(RejectionLocation) })
      .then(() => { return typeText(ElementsToType[7], Route)      }, (RejectionLocation) => { return ChainRejection(RejectionLocation) })
      .then(() => { return typeText(ElementsToType[8], Route, 0)   }, (RejectionLocation) => { return ChainRejection(RejectionLocation) })
      .then(() => { return wait(200, Route)                        }, (RejectionLocation) => { return ChainRejection(RejectionLocation) })
      .then(() => { return blinkCursor(Route, 2)                   }, (RejectionLocation) => { return ChainRejection(RejectionLocation) })
      .then(() => { PurgeCursors(Route.Dom);                       }, (RejectionLocation) => { return ChainRejection(RejectionLocation) })
      .catch( (Location) => { console.log("Animation cancelled in %s", Location) });
  }

});

