UserCallback( (State) => {
  console.log("vim callback");

  let Route = State.Router.routes["/vim"];

  Route.Main = (State) => {

    let Router = State.Router;
    let Cursor = State.Cursor;
    Assert(Router instanceof MakeRouter);
    Assert(Cursor instanceof MakeCursor);

    let ElementsToType = PrepareToTypeRouteElements(Route.DomElem, Cursor);


    blinkCursor(Cursor, 3).then( () => {
      return typeText(ElementsToType[0], Cursor);
    }).then ( () => {
      return typeText(ElementsToType[1], Cursor);
    }).then( () => {
      return typeText(ElementsToType[2], Cursor);
    }).then ( () => {
      return typeText(ElementsToType[3], Cursor);
    }).then ( () => {
      return typeText(ElementsToType[4], Cursor);
    }).then ( () => {
      return typeText(ElementsToType[5], Cursor, 500);
    }).then( () => {
      return typeText(ElementsToType[6], Cursor);
    }).then( () => {
      return typeText(ElementsToType[7], Cursor);
    }).then( () => {
      return typeText(ElementsToType[8], Cursor);
    }).then( () => {
      return blinkCursor(Cursor, 2);
    }).then ( () => {
      SetDisplay(Cursor.DomElem, DISPLAY_NONE);
      // return typeText(ElementsToType[7], Cursor, 300);
    })
  }

});

