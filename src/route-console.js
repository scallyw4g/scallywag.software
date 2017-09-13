
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

    Render(Route.Dom);

    blinkCursor(3).then( () => {
      return typeText(ElementsToType[0], Route.Dom);
    }).then ( () => {
      State.Router.navigate("/", State);
    });
  }
});
