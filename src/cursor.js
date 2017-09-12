
function MakeCursor(Elem) {
  this.Target = null;
  this.DomElem = Elem;
}

let blink = (Cursor) => {
  Assert(Cursor instanceof MakeCursor);

  let blinkTime = 750;
  let blinkTick = blinkTime/3;

  return new Promise( (resolve, reject) => {
    SetVisibility(Cursor.DomElem, VISIBILITY_OFF);

    setTimeout( () => {
      SetVisibility(Cursor.DomElem, VISIBILITY_ON);
    }, blinkTick );

    setTimeout( () => {
      resolve();
    }, blinkTick*3 );
  });
}

let blinkCursor = (Cursor, count) => {
  Assert(Cursor instanceof MakeCursor);

  let promise = new Promise( (resolve) => { resolve() } );

  while (--count >= 0) {
    promise = promise.then( () => {
      return blink(Cursor);
    });
  }

  return promise;
}

let SetCursorDim = (Cursor, {width, height}) => {
  Assert(Cursor instanceof MakeCursor);

  Cursor.DomElem.style.width = width + "px";
  Cursor.DomElem.style.height = height + "px";

  return;
}

let SetCursorP = (Cursor, {x, y}) => {
  Assert(Cursor instanceof MakeCursor);

  Cursor.DomElem.style.display = "fixed";
  Cursor.DomElem.style.left = x;
  Cursor.DomElem.style.top = y;

  return;
}

let UpdateCursorP = (Cursor, Elem) => {
  Assert(Cursor instanceof MakeCursor);
  Assert(Elem instanceof TypedElement);

  let bounds = Elem.DomElem.getBoundingClientRect();

  let height = bounds.bottom - bounds.top;
  let width = 0.35 * height;

  let x = bounds.left + Elem.DomElem.offsetWidth;
  let y = bounds.top + Elem.DomElem.offsetHeight - height;

  SetCursorP(Cursor, {x,y} );
  SetCursorDim(Cursor, {width, height});

  return;
}

let RewindCursor = (Cursor, Elem) => {
  Assert(Elem instanceof TypedElement);
  let bounds = Elem.DomElem.getBoundingClientRect();

  let x = bounds.left;
  let y = Cursor.DomElem.style.top;

  SetCursorP(Cursor, {x,y} );
}

let PrepareToType = (Cursor, Elem) => {
  Assert(Cursor instanceof MakeCursor);
  Assert(Elem instanceof TypedElement);

  Cursor.Target = Elem;

  SetDisplay(Elem.DomElem, DISPLAY_INLINE_BLOCK);
  SetVisibility(Elem.DomElem, VISIBILITY_OFF);

  let bounds = Elem.DomElem.getBoundingClientRect();

  let height = bounds.bottom - bounds.top;
  let width = 0.4 * height;

  let x = bounds.left;
  let y = bounds.top;

  SetCursorP(Cursor, {x,y} );
  SetCursorDim(Cursor, {width, height});
}

