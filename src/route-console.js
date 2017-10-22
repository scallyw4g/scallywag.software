UserCallback( (State) => {
  console.log("binding console callback");
  let Route = State.Router.routes["intro"];
  Assert(Route instanceof MakeRoute);

  Route.Main = (State) => {
    console.log("console main");

    let Router = State.Router;
    Assert(Router instanceof MakeRouter);

    let ElementsToType = Array.from(Route.Dom.getElementsByClassName("gets-typed"))
      .map((Dom) => { return new TypedElement(Dom); });

    InitCursor(ElementsToType[0]);

    blinkCursor(Route, 4)
      .then(() => { return typeText(ElementsToType[0], Route) })
      .then(() => { return typeText(ElementsToType[1], Route) })
      .then(() => { return wait(60, Route)                    })
      .then(() => { return blinkCursor(Route, 1)              })
      .then(() => { return wait(60, Route)                    })
      .then(() => { return new Promise( (resolve) => {
        PurgeCursors(Route.Dom);
        InitCursor(ElementsToType[2]);
        resolve();
      })                                                      })
      .then(() => { return wait(140, Route)                   })
      .then(() => {
        SetCookie({name: 'IntroCompleted', value: true});
        return State.Router.navigate("/", State)
      });
  }

});
