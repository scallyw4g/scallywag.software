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

let TypedElement = (Elem) => {
  let Result = {}

  Result.Content = Elem.innerHTML.split("");
  Result.FinalBounds = Elem.getBoundingClientRect();

  Result.DomElem = Elem;

  return Result;
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

let blink = (Cursor) => {
  let blinkTime = 750;
  let blinkTick = blinkTime/3;

  return new Promise( (resolve, reject) => {
    SetVisibility(Cursor, VISIBILITY_ON);

    setTimeout( () => {
      SetVisibility(Cursor, VISIBILITY_OFF);
    }, blinkTick );

    setTimeout( () => {
      SetVisibility(Cursor, VISIBILITY_ON);
    }, blinkTick*2 );

    setTimeout( () => {
      resolve();
    }, blinkTick*3 );
  });
}

let blinkCursor = (Cursor, count) => {

  let promise = new Promise( (resolve) => { resolve() } );

  while (--count >= 0) {
    promise = promise.then( () => {
      return blink(Cursor);
    });
  }

  return promise;
}

let setCursorDim = (Cursor, {width, height}) => {
  Cursor.style.width = width + "px";
  Cursor.style.height = height + "px";
}

let setCursorP = (Cursor, {x, y}) => {
  Cursor.style.position = "fixed";
  Cursor.style.left = x;
  Cursor.style.top = y;

  return;
}

let UpdateCursor = (Cursor, Elem) => {
  let bounds = Elem.DomElem.getBoundingClientRect();

  let height = bounds.bottom - bounds.top;
  let width = 0.35 * height;

  let x = bounds.left + Elem.DomElem.offsetWidth;
  let y = bounds.top + Elem.DomElem.offsetHeight - height;

  setCursorP(Cursor, {x,y} );
  setCursorDim(Cursor, {width, height});

  return;
}

let typeText = (Elem, Cursor, finalDelay = 500) => {

  return new Promise( (resolve, reject) => {
    let text = Elem.Content;
    Elem.DomElem.innerHTML = "";

    SetDisplay(Elem.DomElem, DISPLAY_INLINE_BLOCK);

    let anim = setInterval( () => {
      if (text.length == 0) {
        setTimeout( () => {
          SetVisibility(Cursor, VISIBILITY_ON);
          clearInterval(anim);
          resolve();
        }, finalDelay );

      } else {
        Elem.DomElem.innerHTML += text.shift();
        UpdateCursor(Cursor, Elem);
      }

    }, 50 );

  });
}

let RewindCursor = (Cursor, Elem) => {
  let bounds = Elem.DomElem.getBoundingClientRect();

  let x = bounds.left;
  let y = Cursor.style.top;

  setCursorP(Cursor, {x,y} );
}

let PrepareToType = (Cursor, Elem) => {
  UpdateCursor(Cursor, Elem);
  RewindCursor(Cursor, Elem);
}

let Init = () => {
  return new Promise ( (resolve) => {

    let typedElements = Array.from(document.getElementsByClassName("gets-typed"));

    let content = Array.from(document.getElementsByClassName("content"));
    let Cursor = document.getElementById("cursor");

    let firstElem = TypedElement(typedElements[0]);

    let mainElements = [];

    PrepareToType(Cursor, firstElem);

    for ( let Index = 0;
          Index < typedElements.length;
          ++Index)
    {
      let Elem = typedElements[Index];
      SetDisplay(Elem, DISPLAY_NONE);
      mainElements.push(TypedElement(Elem));
    }

    for ( let Index = 0;
          Index < content.length;
          ++Index)
    {
      let Elem = content[Index];
      SetDisplay(Elem, DISPLAY_NONE);
    }

    SetVisibility(document.body, VISIBILITY_ON);

    resolve(mainElements);
  });
}

let Main = (typedElements) => {

  let Cursor = document.getElementById("cursor");

  blinkCursor(Cursor, 5).then( () => {
    return typeText(typedElements[0], Cursor);
  }).then ( () => {
    return typeText(typedElements[5], Cursor, 500);
  }).then( () => {
    return typeText(typedElements[1], Cursor);
  }).then( () => {
    return typeText(typedElements[2], Cursor);
  }).then ( () => {
    return typeText(typedElements[3], Cursor);
  }).then ( () => {
    return typeText(typedElements[4], Cursor, 0);
  }).then ( () => {
    return blinkCursor(Cursor, 1);
  }).then ( () => {
    return typeText(typedElements[6], Cursor, 0);
  }).then ( () => {
    return blinkCursor(Cursor, 1);
  }).then ( () => {
    return typeText(typedElements[7], Cursor, 300);
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
