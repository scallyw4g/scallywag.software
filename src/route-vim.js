
document.addEventListener( "framework-loaded", (Event) => {
  let State = Event.detail;
  let VimRoute = State.Router.routes["vim"];

  VimRoute.Main = (State) => {
    console.log(State);

    let Router = State.Router;
    let Cursor = State.Cursor;
    let elements = State.elements;

    Assert(elements);
    Assert(Router instanceof MakeRouter);
    Assert(Cursor instanceof MakeCursor);

    blinkCursor(Cursor, 3).then( () => {
      return typeText(elements[0], Cursor);
    }).then ( () => {
      return typeText(elements[5], Cursor, 500);
    }).then( () => {
      return typeText(elements[1], Cursor);
    }).then( () => {
      return typeText(elements[2], Cursor);
    }).then ( () => {
      return typeText(elements[3], Cursor);
    }).then ( () => {
      return typeText(elements[4], Cursor);
    }).then ( () => {
      return typeText(elements[6], Cursor, 0);
    }).then ( () => {
      return blinkCursor(Cursor, 3);
    }).then ( () => {
      SetDisplay(Cursor.DomElem, DISPLAY_NONE);
      // return typeText(elements[7], Cursor, 300);
    })
  }

});
