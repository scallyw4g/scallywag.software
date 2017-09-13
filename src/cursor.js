
let blink = () => {

  let blinkTime = 750;
  let blinkTick = blinkTime/3;

  return new Promise( (resolve, reject) => {
    resolve();
    // Assert(false);

    /*
    SetVisibility(Cursor.Dom, VISIBILITY_OFF);

    setTimeout( () => {
      SetVisibility(Cursor.Dom, VISIBILITY_ON);
    }, blinkTick );

    setTimeout( () => {
      resolve();
    }, blinkTick*3 );
   */
  });
}

let blinkCursor = (count) => {
  let promise = new Promise( (resolve) => { resolve() } );

  while (--count >= 0) {
    promise = promise.then( () => {
      return blink();
    });
  }

  return promise;
}
