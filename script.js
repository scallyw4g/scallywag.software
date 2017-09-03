"use strict";

let VISIBILITY_OFF = "hidden";
let VISIBILITY_ON = "visible";

let DISPLAY_INLINE_BLOCK = "inline-block";
let DISPLAY_BLOCK = "block";
let DISPLAY_NONE = "none";

let TypingElement = null;

let InvalidCodePath = () => { Assert(!"InvalidCodePath"); }

let Assert = ( expression ) => {
  if (!(expression))
    throw "Failed Assertion";
}

let PageLoaded = () => {
  let Result = document.readyState === 'complete';
  return Result;
}

let WaitTillLoaded = setInterval( () => {
  SetVisibility(document.body, VISIBILITY_OFF);
  if ( PageLoaded() ) {
    clearInterval(WaitTillLoaded);
    Init().then ( (typedElements) => Main(typedElements) );
  }
}, 5);

// let BindCallback = (id, event, callback) => {
//   Assert( typeof(id) === "string" );
//   Assert( typeof(event) === "string" );
//   Assert( typeof(callback) === "function" );

//   let Elem = document.getElementById(id);
//   console.log(Elem);
//   Elem['on' + event] = callback;
// }

let TypedElement = () => {
  let Element = {}

  Element.CursorDim = {x,y}
}

let SetVisibility = (element, vis) => {
  element.style.visibility = vis;
}

let ToggleDisplay = (element, d1, d2) => {
  let display = window.getComputedStyle(element).display;

  if (display === d1) {
    element.style.display = d2;

  } else if (display === d2) {
    element.style.display = d1;

  } else { InvalidCodePath() }
}

let SetDisplay = (element, display) => {
  element.style.display = display;
}

let blink = (cursor) => {
  let blinkTime = 750;
  let blinkTick = blinkTime/3;

  return new Promise( (resolve, reject) => {
    SetVisibility(cursor, VISIBILITY_ON);

    setTimeout( () => {
      SetVisibility(cursor, VISIBILITY_OFF);
    }, blinkTick );

    setTimeout( () => {
      SetVisibility(cursor, VISIBILITY_ON);
    }, blinkTick*2 );

    setTimeout( () => {
      resolve();
    }, blinkTick*3 );
  });
}

let blinkCursor = (cursor, count) => {

  let promise = new Promise( (resolve) => { resolve() } );

  while (--count >= 0) {
    promise = promise.then( () => {
      return blink(cursor);
    });
  }

  return promise;
}

let setCursorDim = (cursor, {width, height}) => {
  cursor.style.width = width + "px";
  cursor.style.height = height + "px";
}

let setCursorP = (cursor, {x, y}) => {
  cursor.style.position = "fixed";
  cursor.style.left = x;
  cursor.style.top = y;
}

let UpdateCursor = (cursor, Elem) => {
  let bounds = Elem.getBoundingClientRect();

  let height = bounds.bottom - bounds.top;
  let width = 0.35 * height;

  let x = bounds.left + Elem.offsetWidth;
  let y = bounds.top + Elem.offsetHeight - height;

  setCursorP(cursor, {x,y} );
  setCursorDim(cursor, {width, height});
}

let typeText = (Elem, cursor, finalDelay = 500) => {

  return new Promise( (resolve, reject) => {
    let text = Elem.innerHTML.split("");
    Elem.innerHTML = "";

    SetDisplay(Elem, DISPLAY_INLINE_BLOCK);

    let anim = setInterval( () => {
      if (text.length == 0) {
        setTimeout( () => {
          SetVisibility(cursor, VISIBILITY_ON);
          clearInterval(anim);
          resolve();
        }, finalDelay );

      } else {
        Elem.innerHTML += text.shift();
        UpdateCursor(cursor, Elem);
      }

    }, 50 );

  });
}

let RewindCursor = (cursor, Elem) => {
  let bounds = Elem.getBoundingClientRect();

  let x = bounds.left;
  let y = cursor.style.top;

  setCursorP(cursor, {x,y} );
}

let Init = () => {
  return new Promise ( (resolve) => {

    let typedElements = Array.from(document.getElementsByClassName("gets-typed"));
    let content = Array.from(document.getElementsByClassName("content"));

    let cursor = document.getElementById("cursor");

    UpdateCursor(cursor, typedElements[0]);
    RewindCursor(cursor, typedElements[0]);

    for ( let Index = 0;
          Index < typedElements.length;
          ++Index)
    {
      let Elem = typedElements[Index];
      SetDisplay(Elem, DISPLAY_NONE);
    }

    for ( let Index = 0;
          Index < content.length;
          ++Index)
    {
      let Elem = content[Index];
      SetDisplay(Elem, DISPLAY_NONE);
    }

    SetVisibility(document.body, VISIBILITY_ON);

    resolve(typedElements);
  });
}

let Main = (typedElements) => {

  let cursor = document.getElementById("cursor");

  blinkCursor(cursor, 5).then( () => {
    return typeText(typedElements[0], cursor);
  }).then ( () => {
    return typeText(typedElements[5], cursor, 500);
  }).then( () => {
    return typeText(typedElements[1], cursor);
  }).then( () => {
    return typeText(typedElements[2], cursor);
  }).then ( () => {
    return typeText(typedElements[3], cursor);
  }).then ( () => {
    return typeText(typedElements[4], cursor, 0);
  }).then ( () => {
    return blinkCursor(cursor, 1);
  }).then ( () => {
    return typeText(typedElements[6], cursor, 0);
  }).then ( () => {
    return blinkCursor(cursor, 1);
  }).then ( () => {
    return typeText(typedElements[7], cursor, 300);
  })



  let headings = Array.from(document.getElementsByClassName("heading"));

  for ( let headingIndex = 0;
        headingIndex < headings.length;
        ++headingIndex )
  {
    let Elem = headings[headingIndex];

    Elem.onclick = (event) => {
      let sibling = event.target.nextElementSibling;
      ToggleDisplay(sibling, DISPLAY_NONE, DISPLAY_BLOCK);
    }

  }

  let count = 0;

}
