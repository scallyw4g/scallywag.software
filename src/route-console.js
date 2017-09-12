
UserCallback( (State) => {
  console.log("console callback");
  let Route = State.Router.routes["/console"];

  Route.Main = (State) => {
    let Router = State.Router;
    let Cursor = State.Cursor;
    Assert(Router instanceof MakeRouter);
    Assert(Cursor instanceof MakeCursor);

    let ElementsToType = PrepareToTypeRouteElements(Route.DomElem, Cursor);

    blinkCursor(Cursor, 1).then( () => {
      return typeText(ElementsToType[0], Cursor);
    }).then ( () => {
      return typeText(ElementsToType[1], Cursor);
    }).then ( () => {
      State.Router.navigate("/vim", State);
    });
  }
});
