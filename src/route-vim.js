
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

  Route.FitBottomBar = (Route) => {
    let MainBounds = document.querySelector("#vim-inner").getBoundingClientRect();
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
    let Vim = document.querySelector("#vim");

    let Router = State.Router;
    Assert(Router instanceof MakeRouter);

    let ElementsToType = Route.UserData.ElementsToType;

    InitCursor(ElementsToType[0]);

    let ChainReject = (e) => {
      return new Promise( (_, reject) => { reject(e); });
    }

    Route.FitBottomBar(Route);

    Route.UserData.Animation = wait(200, Route)
      .then(() => { return blinkCursor(Route, 1)                   })
      .then(() => { return wait(100, Route)                        })
      .then(() => { return typeText(ElementsToType[0], Route, 150) })
      .then(() => { return typeText(ElementsToType[1], Route)      })
      .then(() => { return typeText(ElementsToType[2], Route)      })
      .then(() => { return typeText(ElementsToType[3], Route)      })
      .then(() => { return typeText(ElementsToType[4], Route)      })
      .then(() => { return typeText(ElementsToType[5], Route)      })
      .then(() => { return typeText(ElementsToType[6], Route)      })
      .then(() => { return typeText(ElementsToType[7], Route)      })
      .then(() => { return typeText(ElementsToType[8], Route, 0)   })
      .then(() => { return wait(200, Route)                        })
      .then(() => { return blinkCursor(Route, 2)                   })
      .then(() => { PurgeCursors(Route.Dom);                       })
  }

});

