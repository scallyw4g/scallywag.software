UserCallback( (State) => {
  console.log("binding console callback");
  let Route = State.Router.routes["/console"];
  Assert(Route instanceof MakeRoute);

  Route.Main = (State) => {
    console.log("console main");

    let Router = State.Router;
    Assert(Router instanceof MakeRouter);

    let ElementsToType = Array.from(Route.Dom.getElementsByClassName("gets-typed"))
      .map((Dom) => { return new TypedElement(Dom); });

    InitCursor(ElementsToType[0]);
    Render(Route.Dom);

    blinkCursor(Route.Dom, 5)
      .then(() => { return typeText(ElementsToType[0], Route.Dom) } )
      .then(() => { return wait(100) } )
      .then(() => { return blinkCursor(Route.Dom, 1) } )
      .then(() => { return wait(100) } )
      .then(() => { return new Promise( (resolve) => {
        PurgeCursors(Route.Dom);
        InitCursor(ElementsToType[1]);
        Render(Route.Dom);
        resolve();
      }) })
      .then(() => { return wait(140) } )
      .then(() => { return State.Router.navigate("/", State) } );
  }

});
