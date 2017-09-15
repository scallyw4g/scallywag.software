let InitCursor = (CursorElement) => {
  Assert(CursorElement instanceof TypedElement);

  CursorElement.Dom.classList.add("typing-active");
  SetDisplay(CursorElement.Dom, DISPLAY_INLINE_BLOCK);
}


let blink = (Cursor) => {
  Assert(Cursor instanceof HTMLElement);

  let blinkTime = 650;
  let blinkTick = blinkTime/3;

  return new Promise( (resolve, reject) => {

    // Blink off
    Cursor.classList.add("cursor-off");

    // Blink on
    setTimeout( () => {
      Cursor.classList.remove("cursor-off");
    }, blinkTick );

    // Fin
    setTimeout( () => {
      resolve();
    }, blinkTick*3 );
  });
}

let blinkCursor = (Dom, count) => {
  Assert(Dom instanceof HTMLElement);

  let Cursor = Dom.querySelector(".typing-active");
  Assert(Cursor instanceof HTMLElement);

  // TODO(Jesse): Is there a better way to do this?
  let promise = new Promise( (resolve) => { resolve() } );

  while (--count >= 0) {
    promise = promise.then( () => {
      return blink(Cursor, Dom);
    });
  }

  return promise;
}
