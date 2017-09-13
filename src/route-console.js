
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

    ElementsToType[0].Dom.classList.add("typing-active");

    Render(Route.Dom);

    blinkCursor(Route.Dom, 3)
      .then( () => { return typeText(ElementsToType[0], Route.Dom) } )
      .then( () => { return blinkCursor(Route.Dom, 1) } )
      .then( () => { return State.Router.navigate("/", State) } );
  }

});
