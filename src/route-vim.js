UserCallback( (State) => {
  console.log("binding vim callback");

  let Route = State.Router.routes["/vim"];

  Route.Main = (State) => {

    console.log("vim callback firing");

    let Router = State.Router;
    Assert(Router instanceof MakeRouter);

    let ElementsToType = Array.from(Route.Dom.getElementsByClassName("gets-typed"))
      .map((Dom) => { return new TypedElement(Dom); });

    blinkCursor(1).then( () => {
      return typeText(ElementsToType[0], Route.Dom);
    }).then ( () => {
      return typeText(ElementsToType[1], Route.Dom);
    }).then( () => {
      return typeText(ElementsToType[2], Route.Dom);
    }).then ( () => {
      return typeText(ElementsToType[3], Route.Dom);
    }).then ( () => {
      return typeText(ElementsToType[4], Route.Dom);
    }).then ( () => {
      return typeText(ElementsToType[5], Route.Dom, 500);
    }).then( () => {
      return typeText(ElementsToType[6], Route.Dom);
    }).then( () => {
      return typeText(ElementsToType[7], Route.Dom);
    }).then( () => {
      return typeText(ElementsToType[8], Route.Dom, 0);
    }).then( () => {
      return blinkCursor(2);
    }).then ( () => {
      // SetDisplay(Cursor.Dom, DISPLAY_NONE);
      // return typeText(ElementsToType[7], 300);
    })
  }

});

